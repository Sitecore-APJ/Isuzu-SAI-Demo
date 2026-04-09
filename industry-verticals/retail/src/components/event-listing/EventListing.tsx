import {
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  DateField,
  Placeholder,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faDollarSign, faTag } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ComponentProps } from '@/lib/component-props';
import Link from 'next/link';
import { useI18n } from 'next-localization';
import {
  type Event,
  getEventStatusCounts,
  sortByEventStartDateDesc,
} from '@/helpers/eventListingUtils';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '../non-sitecore/Pagination';
import {
  formatAudWholeDollars,
  formatEventDateDisplay,
  parseNumericFieldValue,
} from '../event-details/formatEventDateRange';

export type { Event } from '@/helpers/eventListingUtils';

interface EventListingProps extends ComponentProps {
  params: { [key: string]: string };
  fields: {
    items: {
      id: string;
      url: string;
      fields: Event;
    }[];
  };
}

export const Default = (props: EventListingProps) => {
  const { t } = useI18n();
  const { page } = useSitecore();
  const id = props.params.RenderingIdentifier;
  const searchBarPlaceholderKey = `event-listing-search-bar-${props.params.DynamicPlaceholderId}`;
  const sideBarPlaceholderKey = `event-listing-side-bar-${props.params.DynamicPlaceholderId}`;
  const isPageEditing = page.mode.isEditing;

  const events =
    props.fields?.items
      ?.filter((item) => item.fields && Object.keys(item.fields)?.length > 0)
      .sort(sortByEventStartDateDesc) ?? [];

  const statusCounts = getEventStatusCounts(events);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = selectedStatus
    ? events.filter((item) => item.fields?.EventStatus?.value === selectedStatus)
    : events;

  const eventsPerPage = 3;
  const { getPageSlice } = usePagination({
    totalItems: filteredEvents.length,
    currentPage,
    itemsPerPage: eventsPerPage,
    windowSize: 3,
  });

  const [startIndex, endIndex] = getPageSlice();
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  return (
    <section className={`component event-listing py-6 ${props?.params?.styles?.trimEnd()}`} id={id}>
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[3fr_1fr]">
        <div className="space-y-16">
          {paginatedEvents.map((item) => {
            const listImage = item.fields?.HeaderImage?.value?.src
              ? item.fields.HeaderImage
              : item.fields?.Image;
            const dateRangeText = formatEventDateDisplay(
              item.fields?.EventStartDate?.value,
              item.fields?.EventEndDate?.value
            );
            const costText = formatAudWholeDollars(
              parseNumericFieldValue(item.fields?.CostPerVehicle)
            );

            return (
              <article key={item.id} className="space-y-4">
                <div className="relative aspect-3/2 w-full overflow-hidden rounded-lg md:aspect-9/4">
                  <ContentSdkImage field={listImage} className="h-full w-full object-cover" />
                </div>

                <div className="space-y-3">
                  <ContentSdkText
                    field={item.fields?.Title}
                    tag="h3"
                    className="font-semibold transition-colors"
                  />

                  <div className="text-foreground-light flex flex-wrap items-center gap-x-10 gap-y-2 text-xs sm:text-sm">
                    {(dateRangeText || isPageEditing) && (
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar as IconProp} />
                        {dateRangeText ? (
                          <span>{dateRangeText}</span>
                        ) : (
                          <DateField
                            field={item.fields?.EventStartDate}
                            render={(d) =>
                              d
                                ? new Date(d).toLocaleDateString('en-AU', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : null
                            }
                          />
                        )}
                      </span>
                    )}

                    {(item.fields?.EventStatus?.value || isPageEditing) && (
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faTag as IconProp} />
                        <ContentSdkText field={item.fields?.EventStatus} />
                      </span>
                    )}

                    {(costText || isPageEditing) && (
                      <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faDollarSign as IconProp} />
                        <span>{costText ?? '—'}</span>
                      </span>
                    )}
                  </div>

                  <ContentSdkText
                    field={item.fields?.ShortDescription}
                    tag="p"
                    className="line-clamp-5 text-justify text-lg"
                  />

                  <Link href={item.url} className="arrow-btn" aria-label="View event details">
                    {t('event_listing_read_more_btn') || 'Read More'}
                  </Link>
                </div>
              </article>
            );
          })}

          <Pagination
            totalItems={filteredEvents.length}
            itemsPerPage={eventsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div className="space-y-8 p-4">
          <Placeholder name={searchBarPlaceholderKey} rendering={props.rendering} />

          <div className="text-foreground mb-5 text-lg font-bold">
            {t('event_listing_status_heading') || 'Event status'}
          </div>
          <ul className="text-foreground-muted space-y-4 text-sm">
            <li className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus(null);
                  setCurrentPage(1);
                }}
                className={`flex-1 text-left ${!selectedStatus ? 'text-accent font-bold' : ''}`}
              >
                {t('show_all_text') || 'Show All'}
              </button>
              <span>{events.length}</span>
            </li>
            {Object.values(statusCounts).map((status) => (
              <li key={status.name} className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus(status.name);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 text-left ${
                    selectedStatus === status.name ? 'text-accent font-bold' : ''
                  }`}
                >
                  {status.name}
                </button>
                <span>{status.count}</span>
              </li>
            ))}
          </ul>

          <Placeholder name={sideBarPlaceholderKey} rendering={props.rendering} />
        </div>
      </div>
    </section>
  );
};
