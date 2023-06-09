import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import FooterBar from "@/components/footer";
import NavigationBar from "@/components/navbar";
import { axiosInstance } from "@/utils/config";
import {
  notifyErrorMessage,
  notifyInfo,
  notifySucces,
} from "@/components/notify";
import Swal from "sweetalert2";
import { Loading } from "@/utils/spinner";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    UserId: "",
    Name: "",
    Email: "",
    Phone: "",
  });
  const [formUserData, setFormUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [seatsBought, setSeatsBought] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Seat: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [verboseMsg, setVerboseMsg] = useState("Loading...");
  const [isEditing, setIsEditing] = useState(false);

  function routeToSeats() {
    router.push("/seats");
  }

  useEffect(() => {
    async function checkIfTokenValid() {
      if (localStorage.getItem("auth_token")) {
        try {
          const res = await axiosInstance.get("/api/v1/user/profile"); //login-only endpoint
          if (res.status === 200) {
          }
          return;
        } catch (err) {
          if (err.response.status !== 200) {
            notifyErrorMessage("Token Expired. Silahkan login kembali.");
            localStorage.removeItem("auth_token");
            router.push("/auth");
          }
        }
      }
    }
    checkIfTokenValid();
  }, []);

  useEffect(() => {
    async function checkIfTokenValid() {
      if (localStorage.getItem("auth_token")) {
        try {
          const res = await axiosInstance.get("/api/v1/user/profile"); //login-only endpoint
          if (res.status === 200) {
            // console.log("All Good.");
          }
          return;
        } catch (err) {
          if (err.response.status !== 200) {
            notifyErrorMessage("Token Expired. Silahkan login kembali.");
            localStorage.removeItem("auth_token");
            router.push("/auth");
          }
        }
      }
    }
    checkIfTokenValid();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      notifyErrorMessage("Anda belum login. Silahkan login terlebih dahulu.");
      router.push("/auth");
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setVerboseMsg("Getting user data...");
        const [userRes] = await Promise.all([
          axiosInstance.get("/api/v1/user/profile"),
        ]);
        setIsLoading(false);
        if (!userRes.data.data.Email || !userRes.data.data.Phone) {
          setIsEditing(true);
          Swal.fire({
            html: `Mohon Lengkapi Nama dan Nomor WhatsApp Anda Agar Dapat Membeli Tiket`,
            toast: false,
            icon: "warning",
            iconColor: "#f6f7f1",
            background: "#2d2d2f",
            color: "#f6f7f1",
            showConfirmButton: true,
            cancelButtonColor: "#c76734",
            confirmButtonText: "Ya, Saya Mengerti",
            confirmButtonColor: "#287d92",
            showClass: {
              popup: "",
            },
          });
        }
        // console.log(userRes.data.data, "ini data");
        setUserData(userRes.data.data);
        setFormUserData({
          name: userRes.data.data.Name,
          email: userRes.data.data.Email,
          phone: userRes.data.data.Phone,
        });
      } catch (err) {
        // console.log(err);
        if (err.response.data.error === "your credentials are invalid") {
          notifyErrorMessage("Token Expired. Silahkan login kembali.");
          router.push("/auth");
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setVerboseMsg("Getting ticket data ...");
        const [ticketRes] = await Promise.all([
          axiosInstance.get("/api/v1/user/tickets"),
        ]);
        setIsLoading(false);
        setSeatsBought(ticketRes.data.data);
      } catch (err) {
        // console.log(err);
        notifyErrorMessage("Gagal mengambil data tiket");
      }
    })();
  }, []);

  // console.log(formUserData);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormUserData({ ...formUserData, [name]: value });
  }

  function confirmSubmit(e) {
    e.preventDefault();
    Swal.fire({
      html: `Apakah anda yakin data yang diisi sudah sesuai?`,
      toast: false,
      icon: "info",
      iconColor: "#f6f7f1",
      background: "#2d2d2f",
      color: "#f6f7f1",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Ya, Saya Yakin",
      cancelButtonText: "Batalkan",
      confirmButtonColor: "#287d92",
      cancelButtonColor: "#c76734",
      showClass: {
        popup: "",
      },
    }).then((result, e) => {
      if (result.isConfirmed) {
        handleSubmit(e);
      }
    });
  }

  useEffect(() => {
    isEditing ? notifyInfo("Mode edit profil aktif") : "";
  }, [isEditing]);

  async function handleSubmit(e) {
    // e.preventDefault();
    try {
      await axiosInstance.patch("api/v1/user/profile", formUserData);
      const [userRes] = await Promise.all([
        axiosInstance.get("/api/v1/user/profile"),
      ]);
      // console.log(userRes);
      setUserData(userRes.data.data);
      notifySucces("Your profile has been successfully updated!");
      setIsEditing(false);
    } catch (err) {
      notifyErrorMessage(err);
    }
  }

  function handleEdit() {
    setIsEditing(!isEditing);
  }

  return (
    <>
      {/* HEADER */}
      <Loading isLoading={isLoading} verboseMsg={verboseMsg} />
      <NavigationBar />
      <div className="max-w-screen h-full bg-gmco-grey">
        {/*This is the header */}
        <div className="relative h-max w-full overflow-hidden ">
          <div className="absolute flex h-64 w-full overflow-hidden bg-gmco-grey">
            <Image
              src="/back-crowd.webp"
              alt="background eventhub"
              className="w-full scale-105 object-cover object-center opacity-50"
              width={1920}
              height={650}
            />
          </div>
          <div className="relative m-auto flex h-full flex-col justify-between pb-8 pt-24 lg:flex-row">
            <div className="items-center px-4 md:items-start md:px-8 lg:ml-40 lg:items-end">
              <h1 className="flex w-max border-b-2 text-2xl font-bold text-gmco-white md:text-4xl lg:text-4xl">
                Profil
              </h1>
            </div>

            <div className="mr-8 flex flex-col items-end lg:mr-48 lg:items-end">
              {Object.keys(userData).map((key) => (
                <p
                  key={key}
                  className={`font-sans text-gmco-yellow ${
                    key === "Name"
                      ? "text-xl font-semibold lg:text-2xl"
                      : key === "UserId"
                      ? "hidden"
                      : "font-normal"
                  }`}
                >
                  {userData[key]}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="container m-auto flex h-max flex-col items-center lg:h-screen lg:flex-row lg:items-start">
          {/* EDIT IDENTITY */}
          <form
            onSubmit={confirmSubmit}
            className="relative inline-block h-full w-full items-start bg-gmco-white p-8 lg:w-1/3 lg:pr-12"
          >
            <div className="right-0 float-right inline-flex items-center space-x-4">
              <div>
                {isEditing ? (
                  <span className="text-md ml-3 font-medium  text-gray-800">
                    Editing
                  </span>
                ) : (
                  <span className="text-md ml-3 font-medium text-gray-800 ">
                    Viewing
                  </span>
                )}
              </div>
              <label className="relative cursor-pointer items-center">
                <input
                  type="checkbox"
                  onChange={handleEdit}
                  checked={isEditing}
                  value="false"
                  className="peer sr-only"
                />
                <div className="peer h-7 w-14 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-slate-500 after:bg-[#00275E] after:transition-all after:content-[''] peer-checked:bg-slate-200 peer-checked:after:translate-x-full peer-checked:after:border-[#00275E] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00275E] "></div>
              </label>
            </div>
            <br />
            {/* Name */}
            <label htmlFor="nama" className=" text-gray-500">
              Nama
            </label>
            <input
              disabled={isEditing ? false : true}
              className="text-md mb-4 mt-2 w-full rounded-[20px] border border-gray-300 py-2 placeholder:font-light placeholder:text-gray-500 focus:ring-gmco-yellow disabled:text-gmco-grey/60 sm:mb-4 md:text-lg"
              type="text"
              pattern=".{3,}"
              placeholder="Masukkan Nama Anda"
              name="name" // update the name property
              value={formUserData.name}
              onChange={handleFormChange}
              title="Name needs to be 3 characters or more"
            />

            {/*Email*/}
            <label htmlFor="email" className="text-gray-500">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              className="text-md mb-4 mt-2 w-full rounded-[20px] border border-gray-300 py-2 placeholder:font-light placeholder:text-gray-500 focus:ring-gmco-yellow disabled:text-gmco-grey/60 sm:mb-4 md:text-lg"
              type="text"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              placeholder="Masukkan Email Anda"
              name="email"
              value={formUserData.email}
              onChange={handleFormChange}
              disabled={isEditing ? false : true}
              title="Please enter a valid email address!"
            />

            {/* Phone Number */}
            <label type="whatsapp" className="text-gray-500">
              Nomor WhatsApp<span className="text-red-500">*</span>
            </label>
            <input
              className="text-md mb-4 mt-2 w-full rounded-[20px] border border-gray-300 py-2 placeholder:font-light placeholder:text-gray-500 focus:ring-gmco-yellow disabled:text-gmco-grey/60 sm:mb-4 md:text-lg"
              type="text"
              pattern="(^\+62|62|08)(\d{8,14}$)"
              placeholder="Masukkan Nomor WhatsApp Anda"
              name="phone"
              disabled={isEditing ? false : true}
              value={formUserData.phone}
              onChange={handleFormChange}
              title="Please enter a valid phone number!"
            />
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isEditing ? false : true}
              className=" mt-4 w-full rounded-full border-2 border-gmco-white bg-gmco-yellow-secondary p-2 font-semibold text-gmco-white shadow-md  duration-300 hover:scale-105  hover:text-gmco-white"
            >
              PERBARUI PROFIL
            </button>
          </form>

          {/* List of Tickets */}
          <div className="flex h-full w-screen flex-col gap-4 overflow-auto bg-gmco-grey px-8 py-8 drop-shadow backdrop-blur-sm backdrop-filter lg:w-full">
            <p className="text-start text-2xl font-medium text-gmco-grey">
              Pembelian Saya &#40;{seatsBought.Seat.length}&#41;
            </p>
            {/* TICKET */}
            {seatsBought.Seat.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center">
                <p className="mb-8 text-center text-2xl text-gmco-white">
                  Anda belum membeli tiket.
                  <br />
                  Silakan menuju ke halaman seat untuk membeli tiket.
                </p>
                <button
                  class="w-1/2 rounded-full border-2 border-gmco-white bg-gmco-yellow-secondary p-2 font-semibold  text-gmco-white duration-300 hover:scale-105 hover:text-gmco-white"
                  onClick={routeToSeats}
                >
                  Beli Sekarang
                </button>
              </div>
            ) : (
              <div />
            )}
            {seatsBought.Seat.map((seat, index) => (
              <div
                key={index}
                className="flex h-fit w-full flex-col rounded-lg border-4 border-gmco-yellow bg-gmco-grey p-4 sm:flex-row"
              >
                {/* Kursi dan Tipe */}
                <div className="my-2 flex w-full items-center justify-center gap-1 space-y-2 text-start sm:w-1/5 sm:flex-col sm:gap-0 sm:text-center">
                  <h1 className="text-lg font-bold text-gmco-white md:text-2xl lg:text-2xl">
                    Seat {seat.name}
                  </h1>
                  <p
                    className={
                      `ml-2 flex items-baseline rounded-lg px-2 py-0.5 text-center text-base font-normal capitalize text-gmco-white sm:w-full sm:justify-center sm:px-0 sm:py-1 sm:text-center md:w-2/3 lg:text-base ` +
                      ({
                        gita: "bg-gmco-orange-secondarydark",
                        sekar: "bg-gmco-orange-secondarylight",
                        tala: "bg-gmco-yellow-secondary",
                        irama: "bg-gmco-yellow",
                        serenada: "bg-gmco-blue",
                      }[seat.category] || "bg-gmco-blue-main")
                    }
                  >
                    {seat.category}
                  </p>
                </div>

                {/* Waktu dan Tempat */}
                <div className="flex  w-full flex-row items-center justify-center p-2 md:justify-between">
                  <div className="ml-3 flex w-1/2 flex-col gap-2 text-start text-sm text-gmco-white sm:w-fit sm:items-start sm:text-start sm:text-sm lg:text-base">
                    <p>
                      <FaMapMarkerAlt className="visible inline" /> Auditorium
                      Driyarkara Sanata Dharma
                    </p>
                    <p>
                      <FaCalendarAlt className="visible inline" /> Sabtu, 10 Juni
                      2023
                    </p>
                    <p>
                      <FaClock className="visible inline" /> Open Gate 17.30 WIB
                    </p>
                  </div>

                  {/* Nama Konser */}

                  <div className=" w-1/2 rounded-md bg-gmco-grey p-4 ">
                    <div className="hidden  items-center rounded-lg bg-gmco-grey py-4 pr-4 sm:flex">
                      <div className="mx-2 overflow-hidden">
                        <Image
                          src="/tickets.webp"
                          alt="Logo tiket"
                          width={80}
                          height={80}
                        />
                      </div>
                      <div>
                        <div className="flex w-full flex-col text-start sm:text-end">
                          <h1 className="text-sm font-bold text-white sm:text-base lg:text-2xl">
                            EventHub
                          </h1>
                          <p className="text-sm font-light text-white lg:text-lg">
                            Ini Tiket
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex w-full flex-col justify-center md:mt-2 lg:-mt-10">
                      <Link
                        href={`/ticket/${seat.link}`}
                        className="delay-15 text-md h-1/2 w-full rounded-md border-2 border-gmco-yellow-secondary px-1.5 py-2 text-center font-bold text-gmco-yellow-secondary transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-gmco-yellow-secondary hover:text-gmco-white focus:-translate-y-1 focus:scale-110 focus:bg-gmco-yellow-secondary focus:text-gmco-white md:px-6 md:py-2 md:text-2xl lg:mt-12"
                      >
                        Lihat Tiket
                      </Link>
                      {/* <Link
                        href=''
                        onClick={notifyErrorMessage(
                          "Mohon maaf, aksi ini belum dapat dilakukan."
                        )}
                        className='delay-15 text-md h-1/2 w-full rounded-md border-2 border-gmco-yellow-secondary px-1.5 py-2 text-center font-bold text-gmco-yellow-secondary transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-gmco-yellow-secondary hover:text-gmco-white focus:-translate-y-1 focus:scale-110 focus:bg-gmco-yellow-secondary focus:text-gmco-white md:px-6 md:py-2 md:text-2xl lg:mt-12'
                      >
                        Kirim Ulang Email
                      </Link> */}
                    </div>
                    {/* <a
                      href={`/ticket/${seat.link}`}
                      className="text-md -center group relative mx-2 -mt-7  h-1/2 w-1/2 text-center sm:mt-0"
                    >
                      <span className="absolute inset-0 w-full translate-x-1 translate-y-1 transform bg-black transition duration-200 ease-out group-hover:-translate-x-0 group-hover:-translate-y-0" />
                      <spa className="align-center absolute inset-0  w-full border-2 border-black bg-gmco-blue-main transition duration-200 ease-out group-hover:bg-gmco-orange-secondarydark"></spa>
                      <span className="relative mx-2 inline-block items-center text-xs font-bold text-gmco-white  transition duration-200 ease-out group-hover:text-gmco-yellow sm:top-6 sm:text-base md:top-2 md:text-lg lg:top-8 xl:top-4 ">
                        Lihat E-Ticket
                      </span>

                      {/* <span class="relative z-10 block overflow-hidden rounded-lg border-2 border-gray-900 px-5 py-3 font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out group-hover:text-white">
                      <span class="absolute inset-0 h-full w-full rounded-lg bg-gmco-blue px-5 py-3"></span>
                      <span class="ease absolute left-0 -ml-2 h-48 w-48 origin-top-right -translate-x-full translate-y-12 -rotate-90 bg-gray-900 transition-all duration-300 group-hover:-rotate-180"></span>
                      <span class="relative">Lihat E-Ticket</span>
                    </span>
                    <span
                      class="absolute bottom-0 right-0 -mb-1 -mr-1 h-12 w-full rounded-lg bg-gray-900 transition-all duration-200 ease-linear group-hover:mb-0 group-hover:mr-0"
                      data-rounded="rounded-lg"
                    ></span> 
                    </a> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
