"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ExhibitHall from "@/components/ExhibitHall";
import Timeline from "@/components/Timeline";
import SeaRoute from "@/components/SeaRoute";
import RedSeal from "@/components/RedSeal";

export default function MuseumPage() {
  return (
    <div>
      {/* 馆名 */}
      <section className="relative px-4 pt-16 pb-10 sm:pt-24 sm:pb-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
        >
          <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-4">
            线 上 展 馆
          </div>
          <h1 className="font-serif text-ink-500 text-3xl sm:text-5xl tracking-wide mb-4">
            侨批纪念馆
          </h1>
          <p className="text-ink-400 text-sm sm:text-base tracking-wider max-w-md mx-auto leading-loose">
            五间小展厅，
            <br />
            讲一段漂洋过海的家书史。
          </p>
          <div className="mt-10 ornament-divider max-w-md mx-auto">
            <span className="text-ink-300 text-xs">※ 请慢慢看 ※</span>
          </div>
        </motion.div>
      </section>

      {/* 展厅一：什么是侨批 */}
      <ExhibitHall
        id="hall-1"
        number="一"
        title="什么是侨批"
        subtitle="它不仅是一封信，也是一笔汇款。"
      >
        <div className="space-y-6 text-ink-500 text-[17px] leading-[2.1]">
          <p>
            侨批，是十九世纪到二十世纪中叶，海外华侨寄回家乡的家书和汇款的合称。
            一封薄薄的信纸里，往往同时夹着钱、消息、与一个家庭的命运。
          </p>
          <p>
            「批」在闽南语和潮汕话里，是「信」的意思。
            一封侨批，可能写着「今寄银十二元，望阿母收讫」；
            也可能只写着——「儿一切平安，勿念」。
          </p>
          <p>
            从汕头、厦门到新加坡、槟城、雅加达、西贡，
            十数万封侨批就这样在海上往返了一百年。
          </p>
          <p className="text-ink-400/90 text-[15px] tracking-wide pt-4">
            2013 年，"侨批档案"被联合国教科文组织列入《世界记忆名录》。
          </p>
        </div>

        {/* 旧式信纸样本 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 relative mx-auto max-w-md"
        >
          <div
            className="relative px-8 py-10 sm:px-10 sm:py-12 border border-ink-300/40"
            style={{
              background:
                "linear-gradient(180deg, #f3e8ce 0%, #e8dbb6 100%)",
              boxShadow:
                "inset 0 0 60px rgba(80,50,20,0.15), 0 18px 40px -16px rgba(40,25,10,0.4)",
            }}
          >
            <div className="font-serif text-ink-500 text-lg leading-[2.2] tracking-wide">
              <p>阿母大人膝下：</p>
              <p className="indent-8">
                儿在南洋一切平安，工号上工已三年有余。
              </p>
              <p className="indent-8">
                今寄银十二元，望阿母收讫。
              </p>
              <p className="indent-8 text-ink-400">敬颂 福安</p>
              <p className="text-right text-ink-400 mt-6">
                儿 阿成 敬上
                <br />
                一九四八年三月
              </p>
            </div>
            <div className="absolute -top-4 -right-4">
              <RedSeal text="侨批" size={62} rotate={-8} />
            </div>
          </div>
          <p className="text-center text-ink-300 text-xs tracking-widest mt-3">
            ※ 摹本 · 非原档
          </p>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/archive"
            className="text-ink-400 hover:text-seal-500 transition-colors text-sm tracking-widest font-serif underline underline-offset-[6px] decoration-ink-300/40"
          >
            想看更多真实样本 → 翻阅原件库
          </Link>
        </div>
      </ExhibitHall>

      <Divider />

      {/* 展厅二：为什么人们下南洋 */}
      <ExhibitHall
        id="hall-2"
        number="二"
        title="为什么人们下南洋"
        subtitle="他们离开，不是为了远方，是为了让家里的人，活下去。"
      >
        <Timeline />
      </ExhibitHall>

      <Divider />

      {/* 展厅三：一封侨批如何抵达家乡 */}
      <ExhibitHall
        id="hall-3"
        number="三"
        title="一封侨批如何抵达家乡"
        subtitle="水客、批局、海路 —— 一封信，要走的不只是地理上的路。"
      >
        <div className="space-y-8">
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            <StepCard
              step="①"
              title="交批"
              text="侨民在南洋把信和银钱交给「水客」，或当地批局。"
            />
            <StepCard
              step="②"
              title="渡海"
              text="货船把成捆的批包带回香港，再转汕头、厦门等口岸。"
            />
            <StepCard
              step="③"
              title="入村"
              text="批脚（送信的人）挑着担子走进村子，叫一声名字，钱与信就到了。"
            />
          </div>

          {/* 海路地图 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.6 }}
            className="mt-10 border border-ink-300/30 p-4 sm:p-6 bg-paper-100/50"
          >
            <SeaRoute />
            <p className="text-center text-ink-300 text-xs tracking-widest mt-3">
              海 路 示 意 · 非 地 理 精 确
            </p>
          </motion.div>

          <p className="text-ink-400 text-[15px] leading-[2.1] pt-4 max-w-prose">
            一封侨批，常常要在海上漂一个月以上。
            遇到风暴或战乱，一年才到，也是常有的事。
            等待，是这门「通信」里最长的工序。
          </p>

          <div className="mt-8 text-center">
            <Link
              href="/map"
              className="text-ink-400 hover:text-seal-500 transition-colors text-sm tracking-widest font-serif underline underline-offset-[6px] decoration-ink-300/40"
            >
              想看一张更详细的海图 → 进入侨批地图
            </Link>
          </div>
        </div>
      </ExhibitHall>

      <Divider />

      {/* 展厅四：留在故乡的人 */}
      <ExhibitHall
        id="hall-4"
        number="四"
        title="留在故乡的人"
        subtitle="一个人下南洋，就有几个人在家乡等。"
      >
        <div className="space-y-8">
          {[
            {
              who: "阿母",
              text: "她不识字，每次批一到，就请隔壁先生来读。读到「儿一切平安」，她才松一口气；读到「近日身体不适」，她就坐到天黑。",
            },
            {
              who: "妻子",
              text: "新婚三月，丈夫便上了船。她守着一亩薄田，每月初一去批局问一次。十几年里，她写过几百封回信，从没去过南洋。",
            },
            {
              who: "孩子",
              text: "他长到七岁，才第一次见父亲。父亲只回来了三个月，又走了。多年以后，他自己也下了南洋，也开始写侨批。",
            },
            {
              who: "等不到的人",
              text: "村口的老榕树下，总有人在数日子。有人等了一辈子，等到的只是一张迟到二十年的死亡通知。",
            },
          ].map((c, i) => (
            <motion.div
              key={c.who}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="border-l-2 border-seal-500/40 pl-6"
            >
              <h3 className="font-serif text-ink-500 text-xl mb-2 tracking-wider">
                {c.who}
              </h3>
              <p className="text-ink-400 leading-[2.1] text-[16px]">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </ExhibitHall>

      <Divider />

      {/* 展厅五：今天我们为什么还要写信 */}
      <ExhibitHall
        id="hall-5"
        number="五"
        title="今天我们为什么还要写信"
        subtitle="我们不再需要等一个月，可有些话，反而更难说出口。"
      >
        <div className="space-y-6 text-ink-500 text-[17px] leading-[2.2]">
          <p>
            我们今天有微信、视频、电话。
            远方变得很近，
            一秒之内就能听见对方的声音。
          </p>
          <p>
            可是有些话，越是能立刻说，越说不出口。
          </p>
          <p>
            写信，会让人慢下来。
            它逼你想清楚：
            <br />
            你究竟想对那个人，说些什么。
          </p>
          <p className="text-ink-400/90">
            也许是一句"我想你"，
            <br />
            也许是一句"对不起"，
            <br />
            也许只是——"我还记得你"。
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          className="mt-14 text-center"
        >
          <Link href="/write" className="btn-seal">
            写一封自己的侨批 →
          </Link>
          <div className="mt-6 text-ink-300 text-xs sm:text-sm tracking-widest">
            或先去 <Link href="/wall" className="underline underline-offset-4 hover:text-seal-500">侨批墙</Link> 看看别人写了什么
          </div>
        </motion.div>
      </ExhibitHall>
    </div>
  );
}

function Divider() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-3xl flex items-center gap-4 text-ink-300">
        <span className="h-px flex-1 bg-ink-300/30" />
        <span className="text-xs tracking-widest">※</span>
        <span className="h-px flex-1 bg-ink-300/30" />
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      className="border border-ink-300/30 bg-paper-100/40 p-5 sm:p-6"
    >
      <div className="text-seal-500 font-serif text-xl mb-2">{step}</div>
      <h4 className="font-serif text-ink-500 text-lg mb-2 tracking-wider">{title}</h4>
      <p className="text-ink-400 text-[14px] leading-relaxed">{text}</p>
    </motion.div>
  );
}
