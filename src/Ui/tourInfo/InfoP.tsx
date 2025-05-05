type InfoBlockProps = {
    label: string;
    value?: string;
    style?: string
  };

export const InfoP = ({ label, value, style }: InfoBlockProps) => (
    <p className={`xl:text-xl text-lg font-bold  ${style}`}>
      {label}: <span className="font-normal">{value}</span>
    </p>
  );