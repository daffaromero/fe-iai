import Image from "next/image";
import Link from "next/link";
import { RevealWrapper } from "next-reveal";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import NavigationBar from "@/components/navbar";
import FooterBar from "@/components/footer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useState, useEffect } from "react";
export default function Home() {
  const [supportAV1, setSupportAV1] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    const canPlayAV1 = video.canPlayType('video/webm; codecs="av01.0.05M.08"');
    if (canPlayAV1 === "probably") {
      setSupportAV1(true);
    } else {
      setSupportAV1(false);
    }
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="max-w-screen bg-gmco-white">
        {/* Hero Section */}
        <div className="relative h-screen w-full overflow-hidden bg-gmco-grey">
          <video
            preload="auto"
            playsInline
            autoPlay
            muted
            loop
            className="#0F222F absolute h-full w-full bg-clip-content object-cover opacity-70"
          >
            {supportAV1 ? (
              <source
                src="/homepage/Abstract Dark Blue moving Circles and Dots Animated Background Video.webm"
                type="video/webm; codecs=av01"
              />
            ) : (
              <source
                src="/homepage/Abstract Dark Blue moving Circles and Dots Animated Background Video.mp4"
                type="video/mp4"
              />
            )}
          </video>
          <RevealWrapper
            rotate={{ x: 10, y: 40, z: 0 }}
            origin="left"
            delay={100}
            duration={2000}
            distance="250px"
          >
            <div className="relative z-10 flex h-screen items-center justify-center bg-cover">
              <div className="flex h-max w-max flex-col flex-wrap items-center justify-center md:flex-row">
                <Image
                  src="/homepage/ticket.webp"
                  alt="logo event"
                  className="mt-auto h-[20vw] w-auto md:-ml-8 md:h-[35vh] xl:-ml-20 xl:h-[45vh]"
                  width={1000}
                  height={1000}
                />
                <div className="w-max text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white drop-shadow md:text-5xl xl:text-7xl ">
                    Jogja Mengsedih
                  </h2>
                  <p className="mb-2 font-normal text-white drop-shadow md:mb-6 md:text-4xl xl:mb-16 xl:text-6xl">
                    Vol. 10
                  </p>
                  <p className="font-normal text-white drop-shadow md:text-2xl">
                    Sabtu, <b>10</b> Juni 2023 @ <b>19.00 WIB</b>
                    <br />
                    Auditorium Driyarkara Sanata Dharma
                  </p>
                </div>
                <div className="mt-4 flex  w-full justify-center md:mt-1 lg:-mt-10">
                  <Link
                    href="/seats"
                    className="delay-15 w-max rounded-md border-2 border-gmco-yellow-secondary px-1.5 py-2 text-lg font-bold text-gmco-yellow-secondary transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gmco-yellow-secondary hover:text-gmco-white focus:-translate-y-1 focus:scale-110 focus:bg-gmco-yellow-secondary focus:text-gmco-white md:px-6 md:py-4 md:text-2xl"
                  >
                    Buy Ticket Now!
                  </Link>
                </div>
              </div>
            </div>
          </RevealWrapper>
        </div>

        {/* Home Content2 - Addie MS */}
        <div className="bg-gmco-white py-16">
          <div
            id="GS"
            className="container mx-auto grid grid-cols-1 items-center justify-between px-10 lg:grid-cols-2"
          >
            {/* Text */}
            <RevealWrapper
              duration={1000}
              distance="0"
              className="text-gmco-gray order-last flex w-full justify-end lg:order-first"
            >
              <div className="py-12 text-center md:text-left lg:w-3/4">
                <div className="text-md font-bold tracking-wide md:text-2xl">
                  Featuring,
                </div>
                <h1 className="mb-4 mt-2 text-2xl font-extrabold leading-tight md:text-7xl">
                  Tulus{" "}
                  <span className="text-gmco-orange-secondarydark">.</span>
                </h1>
                <p className="mb-4 text-justify text-base font-light leading-normal opacity-80 md:text-lg">
                  Seorang musisi, komponis, <i>conductor</i>, dan penata suara
                  asal Indonesia. Kecintaannya pada dunia orkestra diwujudkan
                  bersama Indra U. Bakrie dan Oddie Agam dalam mendirikan{" "}
                  <b className="font-bold">Twilite Orchestra</b> tahun 1991.
                  Untuk meningkatkan apresiasi musik di kalangan remaja, Addie
                  juga mendirikan <b className="font-bold">Twilite Chorus </b>
                  dan <b className="font-bold">Twilite Youth Orchestra</b>.
                  Semangat kebangsaan Addie tercurah dalam album rekaman yang
                  dibuatnya bersama Youk Tanzil, berjudul{" "}
                  <b className="font-bold">Simfoni Negeriku</b>, di mana dia
                  merekam kembali lagu kebangsaan &quot;Indonesia Raya&quot;,
                  serta mengorkestrasi lagu-lagu perjuangan yang sekarang
                  digunakan secara luas. Didukung Garuda Indonesia, Addie juga
                  mengorkestrasi puluhan lagu-lagu daerah yang dikemas dalam
                  album CD{" "}
                  <b className="font-bold">
                    &quot;The Sounds of Indonesia&quot;.
                  </b>
                </p>
                <a
                  className="delay-15 text-gmco-gray border-b-2 py-3 transition duration-300 ease-in-out hover:border-gmco-orange-secondarylight"
                  href="https://id.wikipedia.org/wiki/Addie_MS"
                >
                  More About Addie MS
                </a>
              </div>
            </RevealWrapper>

            <RevealWrapper
              origin="left"
              duration={2000}
              distance="100px"
              className="w-full"
            >
              <div className="flex h-[50vh] items-center md:h-[70vh] md:p-8">
                <Image
                  src="/homepage/tulus_nobg.png"
                  alt="gambar addie ms"
                  className="mx-auto max-h-full w-full overflow-visible object-cover"
                  width={500}
                  height={500}
                />
              </div>
            </RevealWrapper>
          </div>
        </div>

        {/* Home Content 3 - Brian*/}
        <div className="bg-[#191919] py-16">
          <div className="container mx-auto grid grid-cols-1 items-center justify-between px-10 text-gmco-white lg:grid-cols-2">
            {/* GMCO Image */}
            <RevealWrapper
              origin="left"
              duration={2000}
              distance="100px"
              className="w-full"
            >
              <div className="flex h-[50vh] items-center md:h-[90vh] md:p-8">
                <Image
                  src="/homepage/brian2.webp"
                  alt="gambar brian p"
                  className="mx-auto max-h-full w-full object-cover"
                  width={500}
                  height={500}
                />
              </div>
            </RevealWrapper>

            {/* Text */}
            <RevealWrapper
              duration={1000}
              distance="0"
              className="flex w-full justify-start text-gmco-white"
            >
              <div className="py-12 text-center md:text-left lg:w-3/4">
                <div className="text-md font-bold tracking-wide md:text-2xl">
                  Special,
                </div>
                <h1 className="mb-4 mt-2 text-2xl font-extrabold leading-tight md:text-7xl">
                  <span className="">Brian Prasetyoadi</span>
                  <span className="text-gmco-orange-secondarylight">.</span>
                </h1>
                <p className="mb-4 text-justify text-base font-light leading-normal opacity-90 md:text-lg">
                  Penyanyi dan penulis lagu ini pernah mengibarkan bendera
                  Jikustik sebagai vokalis dari tahun 2009-2023. Bersama
                  Jikustik, Brian ikut berkontribusi dalam 4 album studio dan
                  sederetan single. Pria kelahiran Yogyakarta, 13 Oktober 1992
                  ini pernah juga merilis <i>single</i> berjudul Kau
                  Satu-Satunya bersama Gaby, istri tercintanya. Dan jauh
                  sebelumnya lagi, Brian pun pernah menghadirkan 3 karya lagu
                  dalam konsep musikalisasi puisi berjudul Pelabuhan Hati,
                  Pelangi Cinta dan Cahaya Di Penjuru Hati. Kini Brian memulai
                  langkah karirnya sebagai soloist di skena musik tanah air.
                  Sebagai penanda langkah tersebut, Brian memperkenalkan estafet
                  musikalnya dalam single lagu yang diberi judul{" "}
                  <b className="font-bold">Sudah</b>.
                </p>
                <a
                  className="delay-15 border-b-2 border-gmco-orange-secondarylight py-3 text-gmco-white transition duration-300 ease-in-out hover:border-gmco-grey"
                  href="https://open.spotify.com/artist/17Yb156MR5C8M2Ktr22mww"
                >
                  More About Brian Prasetyoadi
                </a>
              </div>
            </RevealWrapper>
          </div>
        </div>

        {/* FAQ */}
        <div id="FAQ" className="flex flex-col bg-[#191919] p-10 ">
          <RevealWrapper
            origin="left"
            duration={1500}
            distance="100px"
            className="mx-auto"
          >
            <h1 className=" mb-6 text-3xl font-bold text-gmco-white">
              Frequently Asked Questions
            </h1>
          </RevealWrapper>

          <RevealWrapper
            className="container mx-auto max-w-full items-center justify-center"
            duration={1000}
            distance="0"
          >
            <Accordion className="rounded-t-lg bg-gmco-white">
              <AccordionSummary
                expandIcon={<ChevronDownIcon className="w-5 text-gmco-grey" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <span className="font-semibold">
                  Hal apa saja yang diperlukan sebelum membeli ticket?
                </span>
              </AccordionSummary>
              <AccordionDetails className="-mt-3">
                <span>
                  a. Akun email yang aktif dan dapat diakses <br />
                  b. Akses ke aplikasi <b>*e-banking</b> atau <b>*e-wallet</b>{" "}
                  yang akan anda gunakan untuk membayar tiket <br />
                  c. (Direkomendasikan) Mengakses website ini melalui perangkat
                  kedua seperti desktop, laptop atau tablet
                </span>
              </AccordionDetails>
            </Accordion>
           
            <Accordion className="bg-gmco-white">
              <AccordionSummary
                expandIcon={<ChevronDownIcon className="w-5 text-gmco-grey" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <span className="font-semibold">
                  Bagaimana cara mengecek tiket yang telah saya beli?
                </span>
              </AccordionSummary>
              <AccordionDetails className="-mt-3">
                <p>
                  a. Tiket yang sudah terbeli dapat dilihat pada :<br />
                  &emsp;1. Halaman profil pada website pembelian <br />
                  &emsp;2. Email yang dikirimkan kepada pengguna dari email
                  official <br />
                  b. Tiket selain yang diperoleh melalui kedua platform yang
                  telah disebutkan di atas dianggap tidak sah dan tidak menjadi
                  tanggung jawab dari panitia penyelenggara.
                </p>
              </AccordionDetails>
            </Accordion>
           
            <Accordion className="rounded-b-lg bg-gmco-white">
              <AccordionSummary
                expandIcon={<ChevronDownIcon className="w-5 text-gmco-grey" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <span className="font-semibold">
                  Apa saja metode pembayaran yang didukung?
                </span>
              </AccordionSummary>
              <AccordionDetails className="-mt-3">
                <span>
                  a. E-banking Mandiri, BNI, BRI, Permata <br />
                  b. E-wallet GoPay, Shopee Pay, OVO, Dana, LinkAja
                </span>
              </AccordionDetails>
            </Accordion>
          </RevealWrapper>
        </div>
      </div>
      <FooterBar />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { req } = ctx;
  let baseURL = "";
  if (`https://${req.headers.host}/` === process.env.NEXT_PUBLIC_BASE_URL) {
    baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  }
  return { props: {} };
}
