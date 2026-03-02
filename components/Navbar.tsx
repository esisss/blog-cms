import { Book, Menu } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/server/auth/auth";
import { SignOutButton } from "./SignOutButton";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="navbar bg-base-100 shadow-sm md:px-10 px-3 ">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl text-nowrap">
          <Book className="w-6 h-6 " />
          <span className="hidden md:inline">Blogtise</span>
        </Link>
      </div>

      <div className="flex flex-row justify-between w-full  gap-2">
        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered sm-w-full mx-auto md:w-1/2"
          />
        </div>

        <div className="hidden md:flex gap-2">
          {session ? (
            <>
              <Link href="/?createPost=true" className="btn btn-ghost">
                Create Post
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <div className="dropdown dropdown-end md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-square">
            <Menu className="w-6 h-6" />
          </div>
          <ul className="dropdown-content menu bg-base-100 rounded-box z-50 mt-5 w-52 p-2 shadow">
            {session ? (
              <>
                <li>
                  <Link href="/?createPost=true">Create Post</Link>
                </li>
                <li>
                  <SignOutButton className="btn btn-ghost w-full justify-start" />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signin" className="btn mb-2">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="btn btn-primary mb-1 w-full ">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
