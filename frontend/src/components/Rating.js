import { useContext } from "react";
import { Store } from "../Store";
import translator from "../translator";

function Rating(props) {
  const { state} = useContext(Store);
  const { lang,defLang} = state;
  
  
  const { rating, numReviews, caption } = props;
    return (
      <div className="rating">
        <span>
          <i
            className={
              rating >= 1
                ? 'fas fa-star'
                : rating >= 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 2
                ? 'fas fa-star'
                : rating >= 1.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 3
                ? 'fas fa-star'
                : rating >= 2.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 4
                ? 'fas fa-star'
                : rating >= 3.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          />
        </span>
        <span>
          <i
            className={
              rating >= 5
                ? 'fas fa-star'
                : rating >= 4.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          />
        </span>
        {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{' ' + numReviews +''+ translator.product.frontEnd.reviews[lang]||translator.product.frontEnd.reviews[defLang] ||' reviews'}</span>
      )}
      </div>
    );
  }
  export default Rating;