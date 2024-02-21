import { Room } from "@src/components/Room";

interface RoomPageProps {
  params: {
    id: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="p-6">
      <div className="mb-4">{`Room ID: ${params.id}`}</div>
      <Room />
    </div>
  );
}
