import { Chat } from "@src/components/Chat";
import Logs from "@src/components/Logs";

interface RoomPageProps {
  params: {
    id: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="p-6">
      <div>{`Room #${params.id}`}</div>
      <Chat roomId={params.id} />
      <Logs />
    </div>
  );
}
