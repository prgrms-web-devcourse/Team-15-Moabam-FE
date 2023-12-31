import { useState, useContext, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import roomAPI from '@/core/api/functions/roomAPI';
import { useMoveRoute } from '@/core/hooks';
import { useLocalStorage } from '@/core/hooks';
import { RoomInfo } from '@/core/types/Room';
import { BottomSheet, useBottomSheet } from '@/shared/BottomSheet';
import { Tab, TabItem } from '@/shared/Tab';
import { Icon } from '@/shared/Icon';
import { LoadingSpinner } from '@/shared/LoadingSpinner';
import { Toast } from '@/shared/Toast';
import { DateRoomDetailContext } from './RoomDetailProvider';
import RoomCalendar from './RoomCalendar';
import CertificationProgress from './CertificationProgress';
import RoomRoutine from './RoomRoutine';
import RoomMembers from './RoomMembers';

interface extendedProps {
  status: 'pending' | 'error' | 'success';
}

type RoomWorkspaceProps = extendedProps & RoomInfo;

const RoomWorkspace = ({
  completePercentage,
  routines,
  todayCertificateRank,
  certifiedDates,
  certifyTime,
  status,
  roomId,
  managerNickName,
  maxUserCount,
  currentUserCount
}: RoomWorkspaceProps) => {
  const moveTo = useMoveRoute();
  const [reportStatus, setReportStatus] = useState<boolean>(false);
  const { bottomSheetProps, toggle, close } = useBottomSheet();
  const [userId] = useLocalStorage('MEMBER_ID', null);

  const { chooseDate, serverTime, roomCreatedDate } = useContext(
    DateRoomDetailContext
  );

  const isTodayRoom = chooseDate.getDate() === serverTime.getDate();
  const chooseDateString = `${chooseDate.getFullYear()}${
    chooseDate.getMonth() + 1
  }${chooseDate.getDate() < 10 ? 0 : ''}${chooseDate.getDate()}`;

  const myCertificationImage = todayCertificateRank.find(({ memberId }) => {
    return memberId === userId;
  })?.certificationImage?.images;

  const { mutate } = useMutation({
    mutationFn: roomAPI.deleteRoom
  });

  const handleRoomLeave = () => {
    mutate(`${roomId}`, {
      onSuccess: () => {
        close();
        moveTo('routines');
        Toast.show({ message: '방을 나갔습니다', status: 'confirm' });
      },
      onError: (err) => {
        Toast.show({
          message: err.response?.data.message ?? '오류가 발생했어요.',
          status: 'danger'
        });
      }
    });
  };

  const changeReportStatus = (value: boolean) => {
    setReportStatus(value);
  };

  const handleLogLinkClick = (
    e: MouseEvent,
    serverTime: Date,
    certifyTime: number
  ) => {
    const certifyStartTime = new Date(serverTime);
    certifyStartTime.setHours(certifyTime);
    certifyStartTime.setMinutes(0);
    certifyStartTime.setSeconds(0);
    certifyStartTime.setMilliseconds(0);

    const roomCreatedCertifyEndTime = new Date(roomCreatedDate);
    roomCreatedCertifyEndTime.setHours(certifyTime);
    roomCreatedCertifyEndTime.setMinutes(10);
    roomCreatedCertifyEndTime.setSeconds(0);
    roomCreatedCertifyEndTime.setMilliseconds(0);

    if (
      chooseDate.getDate() === serverTime.getDate() &&
      certifyStartTime.getTime() > serverTime.getTime()
    ) {
      e.preventDefault();
      Toast.show(
        {
          message: '인증 시간 이후 확인 가능합니다',
          status: 'info'
        },
        2000
      );
      return;
    }
  };

  return (
    <>
      <Tab
        align="center"
        defaultIndex={0}
      >
        <TabItem title="루틴">
          <RoomCalendar
            certifiedDates={certifiedDates}
            certifyTime={certifyTime}
          />
          {status !== 'success' ? (
            <div className="flex h-[22.6rem] items-center justify-center">
              <LoadingSpinner size="2xl" />
            </div>
          ) : (
            <>
              {isTodayRoom ? (
                <>
                  <CertificationProgress
                    percentage={completePercentage}
                    certifyTime={certifyTime}
                  />
                  <div className="flex justify-end">
                    <Link
                      to={`log/${chooseDateString}`}
                      className="mb-[2.13rem] flex w-fit items-center text-sm text-light-point dark:text-dark-point"
                      state={{
                        todayCertificateRank,
                        routines,
                        chooseDate,
                        managerNickName
                      }}
                      onClick={(e: MouseEvent) => {
                        handleLogLinkClick(e, serverTime, certifyTime);
                      }}
                    >
                      인증사진 보러가기
                      <Icon
                        size="2xl"
                        icon="BiChevronRight"
                      />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="mb-[2.12rem] flex h-[2.56rem] w-full items-center justify-center rounded-[62.43rem] bg-light-point dark:bg-dark-point">
                  <Link
                    to={`log/${chooseDateString}`}
                    className="flex w-fit items-center text-base"
                    state={{
                      todayCertificateRank,
                      routines,
                      chooseDate,
                      managerNickName
                    }}
                    onClick={(e: MouseEvent) => {
                      handleLogLinkClick(e, serverTime, certifyTime);
                    }}
                  >
                    이날의 인증사진 모음집
                    <Icon
                      size="2xl"
                      icon="BiChevronRight"
                    />
                  </Link>
                </div>
              )}
              <RoomRoutine
                routines={routines}
                myCertificationImage={myCertificationImage}
                certifiedDates={certifiedDates}
                certifyTime={certifyTime}
              />
            </>
          )}
          <button
            className="mt-[1.19rem] text-sm text-black  dark:text-white"
            onClick={() => {
              if (myCertificationImage && myCertificationImage.length > 0) {
                Toast.show({
                  status: 'danger',
                  message: '인증한 날은 방을 나갈 수 없어요..'
                });
              } else {
                toggle();
              }
            }}
          >
            방 나가기
          </button>
        </TabItem>
        <TabItem title="멤버">
          <RoomMembers
            members={todayCertificateRank}
            reportStatus={reportStatus}
            changeReportStatus={changeReportStatus}
            managerNickName={managerNickName}
            maxUserCount={maxUserCount}
            currentUserCount={currentUserCount}
          />
          {todayCertificateRank.length > 1 && (
            <button
              className="mt-[1.62rem] text-sm text-black dark:text-white"
              onClick={() => {
                setReportStatus((prev) => !prev);
              }}
            >
              {reportStatus ? '취소하기' : '신고하기'}
            </button>
          )}
        </TabItem>
      </Tab>
      <BottomSheet {...bottomSheetProps}>
        <div className="mx-[1.37rem] mb-[1.31rem] mt-[3.37rem]">
          <h1 className="mb-1.5 font-IMHyemin-bold text-xl text-light-point dark:text-dark-point">
            방을 나가실래요?
          </h1>
          <span className="mb-[3.44rem] block text-sm">
            다시 돌아올 수는 있지만, 기여도는&nbsp;
            <strong className="text-danger">초기화</strong>됩니다.
          </span>
          <button
            className="btn btn-transition btn-danger w-full"
            onClick={handleRoomLeave}
          >
            나가기
          </button>
        </div>
      </BottomSheet>
    </>
  );
};

export default RoomWorkspace;
