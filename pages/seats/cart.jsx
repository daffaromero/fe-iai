import Image from "next/image";
import { useState, useEffect } from "react";

import Swal from "sweetalert2";
import { TrashIcon } from "@heroicons/react/24/solid";

import FooterBar from "@/components/footer";
import NavigationBar from "@/components/navbar";
import { axiosInstance } from "@/utils/config";
import {
  notifyError,
  notifySucces,
  notifyErrorMessage,
  notifyInfo,
  notifyWarning,
} from "@/components/notify";
import { Loading } from "@/utils/spinner";

export default function Cart() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [update, setUpdate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [verboseMsg, setVerboseMsg] = useState("Loading...");
  const [seatBoughts, setSeatBoughts] = useState({
    seats: [],
    user_email: "user.email",
    user_name: "user_name",
    user_phone: "user_phone",
  });
  const category = {
    gita: "bg-gmco-orange-secondarydark",
    sekar: "bg-gmco-orange-secondarylight",
    tala: "bg-gmco-yellow-secondary",
    irama: "bg-gmco-yellow",
    serenada: "bg-gmco-blue",
    harmoni: "bg-gmco-blue-main",
  };

  function rerender() {
    setUpdate(`update ${Math.random()}`);
  }

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
      notifyErrorMessage("Anda belum login.");
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const [res] = await Promise.all([
          axiosInstance.get("/api/v1/checkout"),
        ]);
        setSeatBoughts(res.data.data);
        // console.log(res.data.data.midtrans_client_key)
        midtransSetup(res.data.data.midtrans_client_key);
      } catch (err) {
        notifyErrorMessage("Anda belum melakukan transaksi.");
      }
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    const seats = seatBoughts.seats;
    let priceSum = 0;
    for (let i = 0; i < seats.length; i++) {
      priceSum += seats[i].price;
    }
    setOrderTotal(priceSum);
  }, [seatBoughts]);

  async function handleCheckout() {
    if (!isAdmin) {
      try {
        const res = await axiosInstance.post("/api/v1/checkout");
        openMidtransWindow(res.data.snap_response.token);
      } catch (err) {
        notifyError(err);
      }
    } else {
      notifyErrorMessage("Admin tidak bisa membeli tiket");
    }
  }

  function midtransSetup(myMidtransClientKey) {
    // You can also change below url value to any script url you wish to load,
    // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
    const midtransScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SCRIPT_URL;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // Optional: set script attribute, for example snap.js have data-client-key attribute
    // (change the value according to your client-key)
    // const midtransClientKey = process.env.NEXT_MIDTRANS_CLIENT_KEY
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }

  function openMidtransWindow(token) {
    window.snap.pay(token, {
      onSuccess: function () {
        /* You may add your own implementation here */
        notifySucces("Payment successful!");
        rerender();
        setSeatBoughts({
          seats: [],
          user_email: "user.email",
          user_name: "user_name",
          user_phone: "user_phone",
        });
      },
      onPending: function () {
        /* You may add your own implementation here */
        notifyInfo("Waiting for your payment...");
      },
      onError: function () {
        /* You may add your own implementation here */
        notifyErrorMessage("Payment failed!");
      },
      onClose: function () {
        /* You may add your own implementation here */
        notifyWarning("You closed the pop-up without finishing the payment.");
      },
    });
  }

  function cancelCheck() {
    Swal.fire({
      html: `Anda yakin ingin menghapus transaksi?`,
      toast: true,
      icon: "warning",
      background: "#2d2d2f",
      iconColor: "#287d92",
      showCancelButton: true,
      cancelButtonText: "Tidak",
      cancelButtonColor: "#c76734",
      confirmButtonText: "Ya",
      confirmButtonColor: "#287d92",
      color: "#f6f7f1",
      showClass: {
        popup: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancel();
      }
    });
  }

  async function handleCancel() {
    try {
      await axiosInstance.delete("/api/v1/checkout").then(() => {
        setSeatBoughts({
          seats: [],
          user_email: "user.email",
          user_name: "user_name",
          user_phone: "user_phone",
        });
        notifySucces("Pesanan Dihapus");
        rerender();
        localStorage.removeItem("user_seats_pick");
      });
    } catch (err) {
      notifyError(err);
    }
  }

  function formatNumber(number) {
    const idrMoney = number.toLocaleString("id-ID", {
      style: "decimal",
      minimumFractionDigits: 2,
    });
    return `Rp${idrMoney}`;
  }

  return (
    <>
      <Loading isLoading={isLoading} verboseMsg={verboseMsg} />
      <NavigationBar doUpdate={update} />
      <div className="max-w-screen relative overflow-hidden bg-[#2c2c2c] md:min-h-screen">
        <div className="absolute h-48 w-full overflow-hidden bg-gmco-grey">
          <Image
            src="/MoreMicon.webp"
            className="h-full w-full object-cover opacity-40 md:object-right"
            alt="gmco mini concert"
            width={1920}
            height={1281}
          />
        </div>

        <div className="container relative m-auto px-6 pb-12 pt-28 md:px-1 ">
          <h2 className="w-max border-b-2 text-2xl font-bold text-gmco-white">
            Keranjang - ({seatBoughts.seats.length} item)
          </h2>
        </div>

        <div className="container m-auto px-6 pb-8 md:px-1">
          <div className="grid gap-10 overflow-hidden py-6 md:grid-cols-5">
            <div className="mt-2 h-max rounded-lg bg-gmco-white md:col-span-3 ">
              {/* Display List */}
              <table className="w-full table-auto border-separate border-spacing-y-4 border-gmco-grey text-gmco-grey">
                {/* Item - nanti di map */}
                <thead>
                  <tr className="text-center text-lg font-semibold md:text-xl">
                    <td className="text-center">No. Kursi</td>
                    <td className="text-center">Kategori</td>
                    <td className="text-center">Harga</td>
                  </tr>
                </thead>
                <tbody>
                  {seatBoughts.seats.map((seatBought, index) => (
                    <tr key={index} className="divide-y">
                      <td className="border-t border-gmco-grey pt-4">
                        <div className="flex justify-center">
                          <h3 className="text-center text-xl font-extrabold">
                            Kursi {seatBought.name}
                          </h3>
                        </div>
                      </td>

                      <td className="border-t border-gmco-grey pt-4">
                        <div className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-3 md:text-sm">
                          <p
                            className={`text-md w-24 rounded-full p-1 text-center font-semibold capitalize text-gmco-white md:p-2 ${
                              category[seatBought.category]
                            }`}
                          >
                            {seatBought.category}
                          </p>
                          <p
                            className={`w-24 rounded-full p-1 text-center font-semibold md:p-2 ${
                              seatBought.name[0] > "S"
                                ? "bg-gmco-white/75 text-gmco-grey"
                                : "bg-gmco-grey/50 text-gmco-white/100"
                            }`}
                          >
                            Lantai {seatBought.name[0] > "S" ? 2 : 1}
                          </p>
                        </div>
                      </td>
                      <td className="border-t border-gmco-grey pt-4">
                        <div className="flex justify-center">
                          {formatNumber(seatBought.price)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bagian Checkout */}
            <div className="md:col-span-2">
              {/* Checkout */}
              <div className="mt-2 h-min space-y-4 rounded-lg bg-gmco-white p-6">
                <p className="text-2xl font-bold">DETAIL TRANSAKSI</p>
                <hr class="my-6 h-px border-0 bg-gmco-grey/70"></hr>
                <div className="flex-col justify-between text-base font-medium text-gmco-grey">
                  <div className="flex items-center justify-between">
                    <p className="text-xl">Subtotal</p>
                    <p>{formatNumber(orderTotal)}</p>
                  </div>
                  {/* <p className='mt-0.5 text-sm text-gmco-grey/70'>
                    Sudah termasuk pajak<span className='text-red-500'> *</span>
                  </p> */}
                </div>

                <div className="mt-6 flex w-full justify-center">
                  <button
                    onClick={() => handleCheckout()}
                    className="flex w-full items-center justify-center rounded-full border-2 border-gmco-grey/50 bg-cyan-900 py-2 text-lg font-bold text-gmco-white transition duration-200 ease-out hover:bg-cyan-700 hover:shadow-lg"
                  >
                    ORDER
                  </button>
                </div>
                <hr class="my-10 h-px border-0 bg-gmco-grey/70"></hr>
                <div className="flex items-center justify-between">
                  <p className="text-md text-gmco-grey">Batalkan Transaksi</p>
                  <button
                    onClick={() => cancelCheck()}
                    className="flex items-center justify-center rounded-md border border-transparent bg-cyan-900 bg-opacity-90 px-6 py-2 text-base font-medium text-white shadow-sm transition duration-200 ease-out hover:bg-cyan-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
}
