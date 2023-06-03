import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { EnvelopeIcon } from "@heroicons/react/24/outline";

import { axiosInstance } from "@/utils/config";
import { notifySucces } from "@/components/notify";

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    // Checks if the currently logged in user is an admin
    async function checkIfAdmin() {
      try {
        const res = await axiosInstance.get("/api/v1/admin/seats"); //admin-only endpoint
      } catch (err) {
        // Only goes here when the status isn't 200 OK
        if (err.response.status !== 200) {
          // console.log(`${err.response.status} ${err.response.statusText}`);
          router.push("/admin/error");
          return false;
        } else {
          console.error(err); // Handles misc. errors
        }
      }
      return true; // If user is an admin
    }

    function adminHandler() {
      // If user is logged in, redirect to /admin
      if (localStorage.getItem("auth_token")) {
        checkIfAdmin();
      }
    }

    // Check if admin is logged in
    if (typeof window !== "undefined") {
      adminHandler();
    }
  }, [router.pathname]);

  const [loginInput, setLoginInput] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function handleInput(e) {
    e.persist();
    setLoginInput({ ...loginInput, [e.target.id]: e.target.value });
  }

  async function loginSubmit(e) {
    e.preventDefault();
    try {
      // console.log(JSON.stringify(loginInput));
      await axiosInstance
        .post("/api/v1/user/login", {
          name: loginInput.name,
          email: loginInput.email,
          phone: loginInput.phone,
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            localStorage.setItem(
              "auth_token",
              `Bearer ${res.data.token.AccessToken}`
            );
            router.push("/admin");
            notifySucces();
          }
        });
    } catch (err) {
      // console.log(err);
    }
  }

  return (
    <section className="max-w-screen block min-h-screen items-center justify-center bg-gmco-grey p-4 md:flex">
      <div className="relative flex w-full max-w-screen-lg flex-col overflow-hidden rounded-lg bg-cover shadow-lg md:m-10 md:flex-row md:items-center">
        {/* leftside */}
        <div className="absolute h-full w-full bg-gmco-grey">
          <Image
            src="/MoreMicon.webp"
            alt="bg mini concert"
            className="h-full w-auto object-cover opacity-50 "
            width={2000}
            height={4000}
          />
        </div>
        <div className="place relative ml-3 mt-14 flex h-3/6 w-full flex-col p-4 text-white backdrop-filter sm:text-center md:mt-0 md:w-7/12 md:items-start md:p-10 ">
          <h1 className="mb-3 text-4xl font-bold md:text-5xl"> Event Hub </h1>
          <p className="font-base mb-3 text-2xl md:text-3xl">Admin</p>
        </div>

        <div className="right-0 mt-7 flex w-full flex-col items-center space-y-8 bg-gray-400 bg-opacity-50 p-4 py-32 backdrop-blur-sm backdrop-filter md:mt-0 md:w-5/12 md:py-40 ">
          <div className="-mt-7 flex flex-col items-center">
            <h1 className="mb-3 text-4xl font-bold text-gmco-white">
              Login Admin
            </h1>
          </div>
          <form
            action="#"
            className="flex flex-col items-center space-y-4"
            onSubmit={loginSubmit}
          >
            <div className="w-full justify-center">
              <label className="inline-block text-center text-base text-gmco-white">
                Masukkan email, nama, dan nomor telepon admin.
              </label>
              <div className="relative flex flex-col items-center justify-center">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => handleInput(e)}
                  value={loginInput.email}
                  className="mt-2 w-11/12 rounded-[20px] border border-gray-300 py-2 placeholder:font-light placeholder:text-gray-500"
                  id="email"
                />
                <EnvelopeIcon className="absolute right-8 top-3.5 h-7 w-7 stroke-slate-400">
                  {" "}
                </EnvelopeIcon>
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => handleInput(e)}
                  value={loginInput.name}
                  className="mt-2 w-11/12 rounded-[20px] border border-gray-300 py-2 placeholder:font-light placeholder:text-gray-500"
                  id="name"
                />
                <input
                  type="number"
                  placeholder="Phone"
                  onChange={(e) => handleInput(e)}
                  value={loginInput.phone}
                  className="mt-2 w-11/12 rounded-[20px] border border-gray-300 py-2 placeholder:font-light placeholder:text-gray-500"
                  id="phone"
                />
              </div>
            </div>
            <label className="my-2 text-center text-sm text-gmco-white">
              Khusus untuk administrator.
            </label>

            <button
              type="submit"
              className="mb-6 w-full rounded-full bg-gmco-yellow-secondary p-2 font-semibold text-white shadow-md  hover:scale-105 "
            >
              LOG IN
            </button>
            <label className="pt-3 text-center text-xs text-gmco-white">
              Event Hub by Trah Ganjil
            </label>
          </form>
        </div>
      </div>
    </section>
  );
}
