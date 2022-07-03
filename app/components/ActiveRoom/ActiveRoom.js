import Avatar from "react-avatar";
import { joinRoom } from "../../socket/roomHandler";
import { Button } from "../Button/Button";
import ReactTooltip from "react-tooltip";

const ActiveRoom = ({
  creatorUsername,
  amountOfParticipants,
  roomId,
  isUserInRoom,
  className,
}) => {
  const handleJoinActiveRoom = () => {
    if (amountOfParticipants < 4) {
      // join room
      joinRoom(roomId);
    }
  };

  const activeRoomButtonDisabled = amountOfParticipants > 3;
  const roomTitle = `Creator: ${creatorUsername}. Connected: ${amountOfParticipants}`;

  return (
    <>
      <div className={className} data-tip data-for="tooltip">
        <Button
          type="button"
          disabled={activeRoomButtonDisabled || isUserInRoom}
          onClick={handleJoinActiveRoom}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
          }}
        >
          <Avatar round="50px" size="50" name={creatorUsername} />
        </Button>
        <ReactTooltip id="tooltip" place="top" effect="solid">
          {roomTitle}
        </ReactTooltip>
      </div>
    </>
  );
};

export default ActiveRoom;
