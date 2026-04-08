import { useEffect, useState } from 'react';
import { Field, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { isParamEnabled } from '@/helpers/isParamEnabled';

interface OfferFields {
  id: string;
  displayName: string;
  name: string;
  url: string;
  fields: {
    OfferText: Field<string>;
  };
}

interface OfferProps extends ComponentProps {
  fields: {
    Offers: OfferFields[];
  };
}

const autoPlayDelay = 5000;

/**
 * Pre-Swiper shell must match on server and first client paint. Sitecore `<Text>` (and
 * `suppressHydrationWarning` on a parent) does not fix child mismatches from FieldMetadata / chromes.
 * Always output the stored value as HTML here; the carousel below still uses `<Text>` after mount
 * (client-only), where hydration is not comparing against SSR for that subtree.
 */
const OfferTextFallback = ({ field }: { field: Field<string> }) => {
  const html = field?.value ?? '';
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const Default = (props: OfferProps) => {
  const { page } = useSitecore();
  const [carouselReady, setCarouselReady] = useState(false);

  useEffect(() => {
    setCarouselReady(true);
  }, []);

  const id = props.params.RenderingIdentifier;
  const uid = props.rendering.uid;
  const datasource = props.fields?.Offers || [];
  const styles = `${props.params.styles || ''}`.trim();
  const autoPlay = isParamEnabled(props.params.Autoplay);

  if (!datasource.length) {
    return page.mode.isEditing ? (
      <div className={`component offers ${styles}`} id={id}>
        [OFFERS]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <div className={`component offers ${styles}`} id={id}>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-5 p-2">
        {!carouselReady ? (
          <div className="no-swiping w-full text-center">
            {datasource[0] && <OfferTextFallback field={datasource[0].fields.OfferText} />}
          </div>
        ) : (
          <>
            <button
              className={`swiper-btn-prev-${uid}`}
              name="previous-offer"
              aria-label="Previous offer"
            >
              <ChevronLeft />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: `.swiper-btn-prev-${uid}`,
                nextEl: `.swiper-btn-next-${uid}`,
                disabledClass: 'pointer-events-none opacity-50',
              }}
              slidesPerView={1}
              centeredSlides
              noSwiping
              noSwipingClass="no-swiping"
              loop={true}
              autoplay={
                autoPlay
                  ? {
                      delay: autoPlayDelay,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              autoHeight
              className="mx-0! w-full transition-all"
            >
              {datasource.map((offer) => (
                <SwiperSlide key={offer.id} className="no-swiping text-center">
                  <Text field={offer.fields.OfferText} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button className={`swiper-btn-next-${uid}`} name="next-offer" aria-label="Next offer">
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
