import * as webllm from "@mlc-ai/web-llm";

export const models = webllm.prebuiltAppConfig.model_list;

export async function getEngine(
    modelId: string,
    progressCallback?: (text: string) => void
): Promise<webllm.MLCEngineInterface> {

    const initProgressCallback = (report: webllm.InitProgressReport) => {
        if (progressCallback) {
            progressCallback(report.text)
        }
    };
    const appConfig: webllm.AppConfig = {
        ...webllm.prebuiltAppConfig,
        cacheBackend: "indexeddb",
    };

    return webllm.CreateMLCEngine(
        modelId,
        {
            initProgressCallback: initProgressCallback,
            logLevel: "INFO",
            appConfig: appConfig,
        },
        {
            context_window_size: 2048,
        },
    );
}
