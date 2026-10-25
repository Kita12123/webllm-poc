import { models, getEngine } from "./engine";
import Agent from "./agent";

const model1 = document.getElementById("model1") as HTMLSelectElement;
const model2 = document.getElementById("model2") as HTMLSelectElement;
models.forEach((m) => {
  const opt1 = document.createElement("option");
  opt1.value = m.model_id;
  opt1.text = `${m.model_id} [${m.vram_required_MB} MB]`;
  model1.add(opt1);

  const opt2 = document.createElement("option");
  opt2.value = m.model_id;
  opt2.text = `${m.model_id} [${m.vram_required_MB} MB]`;
  model2.add(opt2);
});

const init1 = document.getElementById("init1") as HTMLDivElement;
const init2 = document.getElementById("init2") as HTMLDivElement;

const chat1 = document.getElementById("chat1") as HTMLDivElement;
const chat2 = document.getElementById("chat2") as HTMLDivElement;

const systemPrompt = "あなたはしりとりをするボットです。相手が言った単語の最後の1文字から始まる単語を1つだけ答えてください。説明・挨拶・記号は不要です。単語のみを出力してください。「ん」で終わる単語を言ったら負けです。";

let flg = true;
async function start() {
  const [engine1, engine2] = await Promise.all([
    getEngine(model1.value, (text) => init1.innerText = text),
    getEngine(model2.value, (text) => init2.innerText = text),
  ]);
  const agent1 = new Agent("agent1", engine1);
  agent1.setSystemPrompt(systemPrompt);
  const agent2 = new Agent("agent2", engine2);
  agent2.setSystemPrompt(systemPrompt);

  let msg = "「りんご」";
  while (flg) {
    console.log(msg);
    msg = await agent1.ask(msg, (text) => chat1.innerText = text);
    console.log(msg);
    msg = await agent2.ask(msg, (text) => chat2.innerText = text);
  }
}

const startBtn = document.getElementById("start") as HTMLButtonElement;
startBtn.addEventListener("click", (e) => {
  flg = true;
  start()
});

const endBtn = document.getElementById("end") as HTMLButtonElement;
endBtn.addEventListener("click", (e) => {
  flg = false;
})