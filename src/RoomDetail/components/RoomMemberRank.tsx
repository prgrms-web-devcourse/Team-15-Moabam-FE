import { useContext } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { RankMember } from '@/core/types/Member';
import makeTodayCertifyTime from '../utils/makeTodayCertifyTime';
import isMorning from '../utils/isMorning';
import { DateRoomDetailContext } from './RoomDetailProvider';

interface RoomMemberRankProps {
  todayCertificateRank: RankMember[];
  certifyTime: number;
}

const RoomMemberRank = ({
  todayCertificateRank,
  certifyTime
}: RoomMemberRankProps) => {
  const { serverTime } = useContext(DateRoomDetailContext);
  const { certificateTodayEndTime, certificateTodayStartTime, nowTime } =
    makeTodayCertifyTime(certifyTime, serverTime);

  return (
    <>
      {nowTime >= certificateTodayStartTime &&
      nowTime <= certificateTodayEndTime ? (
        <div className="absolute left-1/2 top-[56%] w-[16.1rem] translate-x-[-50%] rounded-[6.25rem] bg-[rgba(0,0,0,0.3)] px-[1.68rem] py-[0.25rem] font-IMHyemin-bold text-white">
          지금은 루틴 "인증시간" 입니다
        </div>
      ) : (
        <>
          {todayCertificateRank
            .filter((el) => el.rank <= 3)
            .map((el) => {
              const { memberId, nickname, rank, awakeImage, sleepImage } = el;

              return (
                <span
                  key={memberId}
                  className={clsx('absolute flex w-fit flex-col items-center', {
                    'top-[39%] left-[37%]': rank === 1,
                    'top-[51%] left-[14%]': rank === 2,
                    'top-[57%] right-[8%]': rank === 3
                  })}
                >
                  <div
                    className={clsx(
                      'relative mb-[0.22rem] h-[3.9rem] w-[3.25rem] bg-contain bg-bottom bg-no-repeat',
                      {
                        "after:absolute after:right-[-14px] after:top-[-10px] after:block after:content-['zzz'] after:origin-center after:rotate-[-16deg]":
                          isMorning(serverTime)
                      }
                    )}
                    style={{
                      backgroundImage: `url(${
                        isMorning(serverTime) ? sleepImage : awakeImage
                      })`
                    }}
                  />
                  <span
                    className={clsx(
                      'block  w-fit rounded-2xl px-3 py-[0.05rem] text-xs text-white',
                      {
                        'bg-gold': rank === 1,
                        'bg-silver': rank === 2,
                        'bg-bronze': rank === 3
                      }
                    )}
                  >
                    {nickname}
                  </span>
                </span>
              );
            })}
        </>
      )}
    </>
  );
};

export default RoomMemberRank;
