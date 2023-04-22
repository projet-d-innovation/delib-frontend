export interface IBaseTemplateProps {
  someProp?: string;
}

const BaseTemplate: React.FC<IBaseTemplateProps> = ({ someProp }) => {
  return (
    <div className="bg-slate-200 rounded-lg shadow-md mb-3 px-3 py-1">
      <div>{someProp}</div>
    </div>
  );
};

export default BaseTemplate;
