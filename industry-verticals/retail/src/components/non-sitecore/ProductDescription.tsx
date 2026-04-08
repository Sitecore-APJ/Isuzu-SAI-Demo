import { Text as ContentSdkText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Product } from '@/types/products';
import StarRating from '../non-sitecore/StarRating';
import { useLocale } from '@/hooks/useLocaleOptions';
import { calculateAverageRating } from '@/helpers/productUtils';

interface ProductDescriptionProps {
  product: Product;
}

export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const { currency } = useLocale();

  const reviews = product?.Reviews || [];
  const reviewCount = reviews.length;
  const averageRating = calculateAverageRating(reviews);

  return (
    <>
      {isPageEditing ? (
        <ContentSdkText
          tag="h1"
          className="pt-3 text-4xl font-bold lg:pt-0"
          field={product.Title}
        />
      ) : (
        <h1 className="pt-3 text-4xl font-bold lg:pt-0">
          {product.Title?.value?.toString() ?? ''}
        </h1>
      )}

      {(product?.Price?.value || isPageEditing) && (
        <p className="text-xl">
          {currency}{' '}
          {isPageEditing ? (
            <ContentSdkText tag="span" field={product.Price} />
          ) : (
            (product.Price?.value?.toString() ?? '')
          )}
        </p>
      )}

      {!!product?.Reviews?.length && (
        <div className="flex items-center space-x-3">
          <span className="text-foreground text-lg">{averageRating}</span>
          <StarRating rating={averageRating} className="!text-accent" />
          <div className="bg-foreground-muted h-7 w-px" />
          <span className="text-foreground-muted text-sm">
            {reviewCount} Customer Review{reviewCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {(product?.ShortDescription?.value || isPageEditing) &&
        (isPageEditing ? (
          <ContentSdkText
            tag="p"
            className="text-foreground text-lg"
            field={product.ShortDescription}
          />
        ) : (
          <p className="text-foreground text-lg">
            {product.ShortDescription?.value?.toString() ?? ''}
          </p>
        ))}
    </>
  );
};
