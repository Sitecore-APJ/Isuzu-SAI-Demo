import {
  ComponentParams,
  ComponentRendering,
  Image,
  ImageField,
  Link,
  LinkField,
  Placeholder,
  RichTextField,
  TextField,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';

interface Fields {
  TitleOne: TextField;
  TitleTwo: TextField;
  TitleThree: TextField;
  TitleFour: TextField;
  TitleFive: TextField;
  CopyrightText: TextField;
  PolicyText: LinkField;
  TermsText: LinkField;
  Logo: ImageField;
  Description: RichTextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterProps) => {
  // rendering item id
  const id = props.params.RenderingIdentifier;

  // placeholders keys
  const phKeyOne = `footer-list-first-${props?.params?.DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${props?.params?.DynamicPlaceholderId}`;
  const phKeyThree = `footer-list-third-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFour = `footer-list-fourth-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFive = `footer-list-fifth-${props?.params?.DynamicPlaceholderId}`;

  const sections = [
    {
      key: 'first_nav',
      title: props.fields.TitleOne?.value?.toString() ?? '',
      content: <Placeholder name={phKeyOne} rendering={props.rendering} />,
    },
    {
      key: 'second_nav',
      title: props.fields.TitleTwo?.value?.toString() ?? '',
      content: <Placeholder name={phKeyTwo} rendering={props.rendering} />,
    },
    {
      key: 'third_nav',
      title: props.fields.TitleThree?.value?.toString() ?? '',
      content: <Placeholder name={phKeyThree} rendering={props.rendering} />,
    },
    {
      key: 'fourth_nav',
      title: props.fields.TitleFour?.value?.toString() ?? '',
      content: <Placeholder name={phKeyFour} rendering={props.rendering} />,
    },
    {
      key: 'fifth_nav',
      title: props.fields.TitleFive?.value?.toString() ?? '',
      content: <Placeholder name={phKeyFive} rendering={props.rendering} />,
    },
  ];

  return (
    <section
      className={`component footer relative ${props.params.styles} overflow-hidden bg-neutral-800 text-white [&_a]:text-white [&_a:hover]:text-neutral-200`}
      id={id}
    >
      <div>
        <div className="container grid gap-12 py-28.5 lg:grid-cols-[1fr_3fr]">
          <div className="flex flex-col gap-7 [&_p]:text-white">
            <div className="sm:max-w-34">
              <Image field={props.fields.Logo} />
            </div>
            <div
              className="[&_a]:text-white"
              dangerouslySetInnerHTML={{
                __html: props.fields.Description?.value?.toString() ?? '',
              }}
            />
          </div>
          <div className="grid gap-13 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5 xl:gap-12">
            {sections.map(({ key, title, content }) => (
              <div key={key}>
                <div className="mb-8 text-lg font-bold text-white">{title}</div>
                <div className="space-y-4 text-white [&_a]:text-white">{content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="container flex items-center justify-between py-8.5 max-sm:flex-col max-sm:items-start max-sm:gap-10">
          <div className="max-sm:order-2 text-white">
            {props.fields.CopyrightText?.value?.toString() ?? ''}
          </div>
          <div className="flex items-center justify-between gap-20 max-lg:gap-10 max-sm:order-1 max-sm:flex-col max-sm:items-start max-sm:gap-5">
            <Link
              field={props.fields.TermsText}
              className="text-white hover:underline hover:text-neutral-200"
            />
            <Link
              field={props.fields.PolicyText}
              className="text-white hover:underline hover:text-neutral-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
