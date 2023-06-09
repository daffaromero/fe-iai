import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import NavBarAdmin from "@/components/navbaradmin";
import { axiosInstance } from "@/utils/config";

export default function Admin() {
  const [isAdmin, setAsAdmin] = useState(false);
  const [adminData, setAdminData] = useState([]);
  // const [appConfig, setAppConfig] = useState(false);
  const [qrScanMode, setQrScanMode] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();

  async function handleGate() {
    const postURL = isChecked
      ? "/api/v1/admin/close_the_gate"
      : "/api/v1/admin/open_the_gate";

    try {
      await axiosInstance.post(postURL).then((res) => {
        setChecked(!isChecked);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAuth() {
    const postURL = authOpen
      ? "/api/v1/admin/close_the_auth"
      : "/api/v1/admin/open_the_auth";

    try {
      await axiosInstance.post(postURL).then((res) => {
        setAuthOpen(!authOpen);
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // Checks if the currently logged in user is an admin
    async function checkIfAdmin() {
      try {
        const res = await axiosInstance.get("/api/v1/admin/healthAdmin"); //admin-only endpoint
        setAsAdmin(true); // If user is an admin
      } catch (err) {
        // Only goes here when the status isn't 200 OK
        if (err.response.status !== 200) {
          // console.log(`${err.response.status} ${err.response.statusText}`);
          setAsAdmin(false); // If user is not an admin
          router.push("/admin/error");
          return false;
        } else {
          console.error(err); // Handles misc. errors
        }
      }
    }

    function notAdminHandler() {
      // If user is not logged in, redirect to /admin/login
      if (!localStorage.getItem("auth_token")) {
        router.push("/admin/login");
      } else {
        // User is logged in -> check if user is an admin or not
        checkIfAdmin();
      }
    }

    if (typeof window !== "undefined") {
      notAdminHandler();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!isAdmin) return;
    axiosInstance.get("/api/v1/admin/get_app_config").then((res) => {
      const isOpenGate =
        res.data.app_config.IsOpenGate.toLowerCase() === "true";
      const isOpenAuth =
        res.data.app_config.IsOpenAuth.toLowerCase() === "true";
      // console.log(isOpenGate);
      setChecked(isOpenGate);
      setAuthOpen(isOpenAuth);
      // console.log(res.data.app_config.QrScanBehaviour);
      setQrScanMode(res.data.app_config.QrScanBehaviour);
    });
    // setChecked(false);
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    axiosInstance.get("/api/v1/admin/seats").then((res) => {
      setAdminData(res.data.data);
    });
  }, [isAdmin]);

  async function updateQrScanState(newState) {
    const patchURL = "/api/v1/admin/qr_scan_behaviour";
    try {
      const res = await axiosInstance.patch(patchURL, {
        qr_scan_behaviour: newState,
      });
      setQrScanMode(newState);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <NavBarAdmin />
      {/* OUTERMOST div */}
      <div className="max-w-screen h-max bg-gmco-white md:min-h-screen ">
        {/* HEADER div */}
        <div className="relative h-max w-full bg-gmco-yellow-secondary">
          <div className="container relative z-10 m-auto px-6 pb-8 pt-24 md:px-1">
            <h2 className="w-max border-b-2 text-2xl font-bold text-gmco-white">
              Admin
            </h2>
          </div>
        </div>

        <div className="container relative m-auto space-y-8 px-6 pb-8 pt-6 md:px-1">
          <div className="relative">
            <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              Open Gate:
            </h3>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                onChange={() => handleGate()}
                checked={false || isChecked}
                value="false"
                className="peer sr-only"
              />
              <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#00275E] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              {isChecked ? (
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Gate is open
                </span>
              ) : (
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Gate is closed.
                </span>
              )}
            </label>
          </div>

          <div className="relative">
            <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              Open Auth:
            </h3>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                onChange={() => handleAuth()}
                checked={authOpen}
                value="false"
                className="peer sr-only"
              />
              <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#00275E] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              {authOpen ? (
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Auth is open
                </span>
              ) : (
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Auth is closed.
                </span>
              )}
            </label>
          </div>

          <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
            Pilih Mode Scan QR:
          </h3>

          <ul className="grid w-full gap-6 md:grid-cols-3">
            <li>
              <input
                type="checkbox"
                onChange={(e) =>
                  updateQrScanState(e.target.checked ? "default" : "")
                }
                checked={qrScanMode === "default"}
                id="default-option"
                value=""
                className="peer hidden"
                required=""
              />
              <label
                htmlFor="default-option"
                className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-[#00275E] peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">Default</div>
                  <div className="w-full text-sm">
                    Mode default scan QR, sebelum dilakukan penukaran tiket.
                  </div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                onChange={(e) =>
                  updateQrScanState(e.target.checked ? "Penukaran" : "")
                }
                checked={qrScanMode === "Penukaran"}
                id="penukaran-option"
                value=""
                className="peer hidden"
              />
              <label
                htmlFor="penukaran-option"
                className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-[#00275E] peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    Penukaran Tiket
                  </div>
                  <div className="w-full text-sm">
                    Mode penukaran digunakan saat masa penukaran tiket.
                  </div>
                </div>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                onChange={(e) =>
                  updateQrScanState(e.target.checked ? "Datang" : "")
                }
                checked={qrScanMode === "Datang"}
                id="datang-option"
                value=""
                className="peer hidden"
              />
              <label
                htmlFor="datang-option"
                className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-[#00275E] peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    Presensi Kedatangan
                  </div>
                  <div className="w-full text-sm">
                    Mode presensi digunakan untuk mengecek kedatangan penonton.
                  </div>
                </div>
              </label>
            </li>
          </ul>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500">
              <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                Data Transaksi Kursi
              </caption>
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr className="border-b bg-white hover:bg-gray-50">
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Seat
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Link
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap py-4 pl-8 pr-4 font-medium text-gray-900">
                      {item.TransactionId}
                    </td>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {item.Seat.Name}
                    </th>
                    <td className="px-6 py-4">{item.Seat.Category}</td>
                    <td className="px-6 py-4">{item.Seat.Price}</td>
                    <td className="px-6 py-4">{item.Seat.Link}</td>
                    <td className="px-6 py-4">{item.User.Name}</td>
                    <td className="px-6 py-4">{item.User.Email}</td>
                    <td className="px-6 py-4">{item.User.Phone}</td>
                    <td className="px-6 py-4">{item.Seat.Status}</td>
                    <td className="px-6 py-4">{item.Seat.PostSaleStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
