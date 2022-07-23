import styles from "../styles/Nav.module.css";
import { useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
const Nav = () => {
  const navRef = useRef(null);
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  console.log("user", user);
  const logout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.status === "success") {
      router.push("/login");
      setUser(null);
    }
  };
  const observer = new IntersectionObserver(
    ([e]) =>
      e.target.classList.toggle(`${styles.isPinned}`, e.intersectionRatio < 1),
    { threshold: [1] }
  );
  if (navRef.current) {
    observer.observe(navRef.current);
  }
  return (
    <>
      <nav className={styles.nav} ref={navRef}>
        <Link href={"/"}>
          <div className={styles.logo}>Bookly</div>
        </Link>
        <div className={styles.searchWrapper}>
          <div className={styles.search}>
            <input
              type="text"
              className={styles.searchField}
              placeholder="Search by title or author"
            />
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.user}>
            {/* <Image src={userPng} layout="fill" /> */}
          </div>
          {/* {user.cartItems.length} */}
          <Link href={"/cart"}>
            <div
              title="Cart"
              className={styles.cart}
              data-content={`${user.cartItems.length}`}
            >
              <Image src={"/cart.png"} height={35} width={35}></Image>
            </div>
          </Link>
          {user.isUser && (
            <div className={styles.cart} onClick={logout} title="Logout">
              <Image src={"/logout.png"} height={20} width={20}></Image>
            </div>
          )}
        </div>
      </nav>
      {/* Linksssssssssss--------- */}
      <div className={styles.navLinks}>
        <a href="#" className={styles.active}>
          Home
        </a>
        <a href="#">Comics</a>
        <a href="#">Finance</a>
        <a href="#">Self help</a>
        <a href="#">Novels</a>
      </div>
    </>
  );
};

export default Nav;