import styles from "../../styles/ProductPage.module.css";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { addToCart } from "../../utils";
import { UserContext } from "../../context/UserContext";
import Reviews from "../../components/Reviews";
import Excerpt from "../../components/Excerpt";
import WriteReview from "../../components/WriteReview";
const ProductPage = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [book, setBook] = useState({});
  const { id } = router.query;
  const [yourReviews, setYourReviews] = useState([]);
  const [otherReviews, setOtherReviews] = useState([]);
  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (user?.cartItems.length > 0) {
        user.cartItems.map((item) => {
          if (item.bookId === data.message._id) {
            setBook(() => {
              return { ...data.message, isInCart: true };
            });
          } else {
            setBook(() => {
              return { ...data.message, isInCart: false };
            });
          }
        });
      } else {
        setBook(() => {
          return { ...data.message, isInCart: false };
        });
      }
    })();

    ///
    if (book.reviews) {
      const filteredReviews = book.reviews.filter((review) => {
        if (review.userId._id === user._id) {
          return true;
        }
      });
      setYourReviews(() => filteredReviews);
      const otherReviews = book.reviews.filter((review) => {
        if (review.userId._id !== user._id) {
          return true;
        }
      });
      setOtherReviews(otherReviews);
    }
  }, [router.isReady, user, book]);

  return (
    <>
      <div className={styles.container}>
        {/* <pre>{JSON.stringify(book.reviews)}</pre> */}
        <div className={styles.bookDetails}>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.authors}>
            By <span>{book?.authors?.join(", ")}</span>
          </p>
          <p className={styles.description}>{book.description}</p>
          <div className={styles.buttons}>
            {book.isInCart ? (
              <button className={`${styles.primary} ${styles.addedToCart}`}>
                Added to cart
              </button>
            ) : (
              <button
                className={styles.primary}
                onClick={() => {
                  addToCart(
                    book._id,
                    book.title,
                    book.image,
                    book.price,
                    setUser
                  );
                }}
              >
                Add to cart
              </button>
            )}
            <button className={styles.secondary}>Reviews</button>
          </div>
        </div>
        <div className={styles.image}>
          <div className={styles.imageWrapper}>
            {book.image && <Image src={book.image} layout="fill"></Image>}
          </div>
        </div>
      </div>
      <div className={styles.postHeroWrapper}>
        <div className={styles.postHero}>
          <div className={styles.excerpt}>
            <Excerpt />
          </div>
          <div className={styles.reviewsContainer}>
            <h2>Reviews</h2>
            <WriteReview id={book._id} />

            <Reviews
              reviews={{
                otherReviews: otherReviews.length > 0 ? otherReviews : [],
                yourReviews: yourReviews.length > 0 ? yourReviews : [],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
