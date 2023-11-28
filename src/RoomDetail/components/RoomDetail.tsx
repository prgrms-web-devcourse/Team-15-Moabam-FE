import { useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { roomOptions } from '@/core/api/options';
import RoomDetailContainer from '@/RoomDetail/components/RoomDetailContainer';
import { RoomNotice } from '@/RoomDetail';
import { RoomDetailMeta } from '@/Meta';
import RoomHeader from './RoomHeader';
import { DateRoomDetailContext } from './RoomDetailProvider';

interface RoomDetailProps {
  roomId?: string;
  checkedRoomJoin: boolean;
}

const RoomDetail = ({ roomId, checkedRoomJoin }: RoomDetailProps) => {
  const { serverTime } = useContext(DateRoomDetailContext);
  const todayDate = `${(serverTime || new Date()).getFullYear()}-${
    (serverTime || new Date()).getMonth() + 1
  }-${(serverTime || new Date()).getDate()}`;

  const { data: roomDetailData } = useSuspenseQuery({
    ...roomOptions.detailByDate(roomId, todayDate)
  });

  const { title, announcement, managerNickname, todayCertificateRank } =
    roomDetailData;

  return (
    <>
      <RoomDetailMeta roomTitle={title} />
      <RoomHeader
        title={title}
        checkedRoomJoin={checkedRoomJoin}
        managerNickname={managerNickname}
        todayCertificateRank={todayCertificateRank}
      />
      <RoomNotice content={announcement} />
      <RoomDetailContainer roomDetailData={roomDetailData} />
    </>
  );
};

export default RoomDetail;