import { isParamEnabled } from '@/helpers/isParamEnabled';
import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  ImageField,
  Link,
  LinkField,
  RichTextField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  Placeholder,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import SocialShare from '../non-sitecore/SocialShare';
import {
  formatAudWholeDollars,
  formatEventDateDisplay,
  parseNumericFieldValue,
} from './formatEventDateRange';
import { EventRegistration } from './EventRegistration';

interface Fields {
  Title: Field<string>;
  ShortDescription: Field<string>;
  Content: RichTextField;
  Image: ImageField;
  EventRegistrationLink: LinkField;
  EventRegistrationId: Field<number>;
  VehiclesPerTrip: Field<number>;
  EventStartDate: Field<string>;
  EventEndDate: Field<string>;
  EventSummary: Field<string>;
  EventStatus: Field<string>;
  CostPerVehicle: Field<number>;
  EventItineraryMedia: Field<{ src?: string; title?: string }>;
}

interface EventDetailsProps extends ComponentProps {
  fields: Fields;
}

const eventRegistrationCtaClassName =
  'inline-flex items-center justify-center rounded-[25px] border border-solid border-[#c21300] bg-[#c21300] px-[1.4rem] py-[0.75rem] text-center uppercase text-white no-underline';

function PlaceholderStatIcon() {
  return (
    <div className="flex size-10 items-center justify-center" aria-hidden>
      <svg
        className="text-foreground-muted size-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export const Default = ({ params, fields, rendering }: EventDetailsProps) => {
  const { page } = useSitecore();
  const [currentUrl, setCurrentUrl] = useState('');
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = params;
  const placeholderKey = `article-details-${DynamicPlaceholderId}`;
  const fullWidthPlaceholderKey = `article-details-full-width-${DynamicPlaceholderId}`;
  const isPageEditing = page.mode.isEditing;
  const hideShareWidget = isParamEnabled(params.HideShareWidget);
  const hasTitleValue = Boolean(fields?.Title?.value?.trim());
  const registrationLinkValue = fields?.EventRegistrationLink?.value;
  const hasRegistrationLink =
    isPageEditing ||
    Boolean(
      (typeof registrationLinkValue?.href === 'string' &&
        registrationLinkValue.href.trim() !== '') ||
      (registrationLinkValue as { id?: string } | undefined)?.id
    );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (!fields) {
    return isPageEditing ? (
      <div className={`component article-details ${styles}`} id={id}>
        [EVENT DETAILS]
      </div>
    ) : (
      <></>
    );
  }

  const eventDateText = formatEventDateDisplay(
    fields.EventStartDate?.value,
    fields.EventEndDate?.value
  );
  const vehiclesPerTripValue = parseNumericFieldValue(fields.VehiclesPerTrip);
  const costPerVehicleFormatted = formatAudWholeDollars(
    parseNumericFieldValue(fields.CostPerVehicle)
  );

  return (
    <>
      <Head>
        <meta property="og:url" content={currentUrl} />
        <meta property="og:name" content={fields?.Title?.value} />
        <meta property="og:title" content={fields?.Title?.value} />
        <meta property="og:description" content={fields?.ShortDescription?.value} />
        <meta property="og:image" content={fields?.Image?.value?.src} />
        <meta property="og:type" content="article" />
      </Head>

      <article className={`component article-details ${styles}`} id={id}>
        <div className="container">
          <div className="grid grid-cols-12 gap-4 py-11">
            {/* Social Share */}
            {!hideShareWidget && (
              <SocialShare
                url={currentUrl}
                title={fields?.Title?.value || ''}
                description={fields?.ShortDescription?.value || ''}
                mediaUrl={fields?.Image?.value?.src || ''}
                className="col-span-12 size-fit p-3 shadow-xl md:p-4 lg:col-span-1 lg:flex-col"
              />
            )}

            <div className="col-span-12 aspect-video w-full overflow-hidden rounded-lg lg:col-span-10 lg:col-start-2">
              <ContentSdkImage field={fields.Image} className="h-full w-full object-cover" />
            </div>

            <div className="col-span-12 mt-8 text-center lg:col-span-8 lg:col-start-3">
              <h2>{hasTitleValue ? <ContentSdkText field={fields.Title} /> : 'Title'}</h2>

              <div className="mt-6 flex justify-center">
                {hasRegistrationLink ? (
                  <Link
                    field={fields.EventRegistrationLink}
                    className={`${eventRegistrationCtaClassName} transition-opacity hover:opacity-95`}
                  />
                ) : (
                  <a
                    href="#"
                    className={`${eventRegistrationCtaClassName} cursor-not-allowed opacity-80`}
                    aria-disabled="true"
                    tabIndex={-1}
                    onClick={(e) => e.preventDefault()}
                  >
                    EVENT CLOSED
                  </a>
                )}
              </div>
              <EventRegistration id={fields.EventRegistrationId?.value} />
              <div className="mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-background-muted flex flex-col items-center justify-center p-[10px]">
                  <PlaceholderStatIcon />
                  <p className="text-foreground mt-3 font-bold">{eventDateText ?? '—'}</p>
                </div>

                <div className="bg-background-muted flex flex-col items-center justify-center p-[10px]">
                  <div className="mt-1.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-solid border-red-600">
                    <span className="text-center font-bold text-red-600">
                      {vehiclesPerTripValue !== undefined ? vehiclesPerTripValue : '—'}
                    </span>
                  </div>
                  <p className="text-foreground mt-3 font-bold">Vehicles per trip</p>
                </div>

                <div className="bg-background-muted flex flex-col items-center justify-center p-[10px]">
                  <PlaceholderStatIcon />
                  <p className="text-foreground mt-3 text-center font-bold">
                    {costPerVehicleFormatted ? <>{costPerVehicleFormatted} per vehicle</> : '—'}
                  </p>
                </div>
              </div>

              <p className="text-foreground-muted mt-5 text-lg font-medium tracking-wide">
                <ContentSdkText field={fields.ShortDescription} />
              </p>

              <div className="mt-10 w-full">
                <div className="col-span-12 !mx-auto lg:col-span-6">
                  <h2 className="font-bold uppercase">ABOUT THE DAY</h2>
                  <div className="rich-text mt-4 text-justify text-lg">
                    <ContentSdkRichText field={fields.EventSummary} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 mt-12 lg:col-span-10 lg:col-start-2">
              <Placeholder name={placeholderKey} rendering={rendering} />
            </div>
          </div>
        </div>
        <Placeholder name={fullWidthPlaceholderKey} rendering={rendering} />
      </article>
    </>
  );
};
