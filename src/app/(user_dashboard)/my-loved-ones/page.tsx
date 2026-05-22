import MyLovedOnesList from '@/components/myLovedOnes/MyLovedOnesList';
import AddLovedOnesSection from '@/components/myLovedOnes/AddLovedOnesSection';

export default function MyLovedOnesPage() {
  return (
    <div className="w-full">
      <div className="space-y-6">
        <MyLovedOnesList />
        <AddLovedOnesSection />
      </div>
    </div>
  );
}
