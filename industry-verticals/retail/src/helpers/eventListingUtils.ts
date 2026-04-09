import type {
  Field,
  ImageField,
  LinkField,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

/** Mirrors `Fields` on `EventDetails` for list items returned by the integrated query. */
export interface Event {
  Title: Field<string>;
  ShortDescription: Field<string>;
  Content: RichTextField;
  Image: ImageField;
  HeaderImage?: ImageField;
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

export const sortByEventStartDateDesc = (
  a: { fields: Event },
  b: { fields: Event }
): number => {
  const getTime = (item: { fields: Event }) =>
    new Date(item.fields.EventStartDate?.value || 0).getTime();

  return getTime(b) - getTime(a);
};

export const getEventStatusCounts = (items: { fields: Event }[]) =>
  items.reduce(
    (acc, item) => {
      const name = item.fields.EventStatus?.value;
      if (name) {
        acc[name] = { name, count: (acc[name]?.count || 0) + 1 };
      }
      return acc;
    },
    {} as Record<string, { name: string; count: number }>
  );
