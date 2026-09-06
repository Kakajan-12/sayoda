type InfoBlockProps = {
  label: string;
  value?: string;
  style?: string;
};

export const InfoLi = ({ label, value, style }: InfoBlockProps) => (
  <li
    className={`xl:text-xl md:text-xs  font-normal mt-2 ml-2 lg:ml-3  ${style}`}
  >
    {label}
  </li>
);
