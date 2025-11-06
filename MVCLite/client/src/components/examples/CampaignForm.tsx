import { CampaignForm } from '../CampaignForm';

export default function CampaignFormExample() {
  const handleSubmit = (data: any) => {
    console.log('Campaign submitted:', data);
  };

  return (
    <div className="p-4">
      <CampaignForm onSubmit={handleSubmit} />
    </div>
  );
}