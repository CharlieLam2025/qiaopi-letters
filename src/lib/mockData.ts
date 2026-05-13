import type { Letter } from "./types";

// 这些是占位的"老侨批样本"，用于在侨批墙没有真实数据时也能呈现出展览感。
// 全部为虚构内容，不影射任何真实人物。
export const MOCK_LETTERS: Letter[] = [
  {
    id: "mock_1",
    to: "阿母",
    from: "新加坡 牛车水",
    destination: "广东 潮安",
    body:
      "阿母大人膝下：\n  儿在南洋一切平安，工号上工已三年有余。今寄银十二元，望阿母收讫，添置冬衣。\n  小妹学堂之事，望阿母代为留意。\n  儿不孝，未能侍奉左右，唯有早夜祷祝阿母康健。\n  敬颂\n  福安",
    tone: "classical",
    theme: "报平安",
    isPublic: true,
    createdAt: "2025-12-04T08:12:00.000Z",
  },
  {
    id: "mock_2",
    to: "外婆",
    from: "马来西亚 槟城",
    destination: "福建 泉州",
    body:
      "外婆，\n上次回家是三年前的春天，您塞给我的那包茶叶我还没舍得喝完。\n您总说南洋热，让我多喝水。我知道。\n等今年农历年，我一定回来。\n您要等我。",
    tone: "gentle",
    theme: "想念",
    isPublic: true,
    createdAt: "2026-01-21T03:00:00.000Z",
  },
  {
    id: "mock_3",
    to: "父亲",
    from: "印尼 雅加达",
    destination: "广东 汕头",
    body:
      "父亲：\n您不在那年，我没有回去。\n这件事，我想了二十年，没说过。\n今天写下来，是想让您知道——\n我一直都记得。",
    tone: "restrained",
    theme: "亏欠",
    isPublic: true,
    createdAt: "2026-02-18T12:30:00.000Z",
  },
  {
    id: "mock_4",
    to: "阿嬷",
    from: "厦门 中山路",
    destination: "厦门 鼓浪屿",
    body:
      "阿嬷，\n您走了之后，我才学会煮您那道豆酱五花肉。\n咸淡总是不对。\n但每次煮，都像您还坐在灶台边看着我。\n谢谢您教过我那么多。",
    tone: "gentle",
    theme: "感谢",
    isPublic: true,
    createdAt: "2026-03-09T15:40:00.000Z",
  },
  {
    id: "mock_5",
    to: "二哥",
    from: "泰国 曼谷",
    destination: "广东 揭阳",
    body:
      "二哥：\n听说你近来身体不好。\n我托人捎了一点钱回去，不多，先用着。\n小时候你护着我那么多次，我都还记得。\n你一定要好好的。",
    tone: "modern",
    theme: "感谢",
    isPublic: true,
    createdAt: "2026-04-02T09:00:00.000Z",
  },
  {
    id: "mock_6",
    to: "阿爸",
    from: "越南 西贡",
    destination: "海南 文昌",
    body:
      "阿爸：\n这是我最后一次给您写信。\n这边的局势不好，我可能要走得更远。\n如果以后没有信回来，您不要等。\n但是请记得——\n您的儿子，一直爱着您。",
    tone: "restrained",
    theme: "告别",
    isPublic: true,
    createdAt: "2026-04-15T22:10:00.000Z",
  },
];
