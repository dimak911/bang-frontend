import Chat from "@src/components/Chat";

interface RoomPageProps {
  params: {
    id: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="p-6">
      <div>{`Room #${params.id}`}</div>
      <Chat />
    </div>
  );
}
