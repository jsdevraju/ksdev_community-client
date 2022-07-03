import { useEffect } from "react";
import { useRouter } from "next/router";
import Privet from "../app/components/Privet/Privet";
import styles from "../styles/Home.module.css";
import { MdGroups, MdPersonAddAlt1 } from "react-icons/md";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineLogout,
} from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import Avatar from "react-avatar";
import { Button } from "../app/components/Button/Button";
import {
  connectWithSocketServer,
  getDirectChatHistory,
  sendDirectMessage,
} from "../app/socket/socketConnection";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Loader } from "../app/components/Loader/Loader";
import { login } from "../app/redux/authSlice";
import toast from "react-hot-toast";
import { Input } from "../app/components/Input/Input";
import { setPendingFriendsInvitations } from "../app/redux/friendSlice";
import { chatType } from "../app/chatActions";
import { setChosenChatDetails } from "../app/redux/messageSlice";
import moment from "moment";
import { createNewRoom } from "../app/socket/roomHandler";
import Room from "../app/components/room/Room";
import ActiveRoom from "../app/components/ActiveRoom/ActiveRoom";
import Meta from '../app/components/Meta/Meta'

function Home() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showmodel, setShowModel] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [toggleSidebar, setToggleSideBar] = useState(false)
  const [targetMailAddress, setTargetMailAddress] = useState("");
  const friends = useSelector(
    (state) => state.friends?.pendingFriendsInvitation
  );
  const allFriends = useSelector((state) => state.friends?.friends);
  const onlineUsers = useSelector((state) => state.friends?.onlineUsers);
  const chosenChatDetails = useSelector(
    (state) => state.chat?.chosenChatDetails
  );
  const messages = useSelector((state) => state.chat?.message);
  const isUserInRoom = useSelector((state) => state.room?.isUserInRoom);
  const activeRooms = useSelector((state) => state.room?.activeRooms);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    connectWithSocketServer(user);
  }, []);

  useEffect(() => {
    getDirectChatHistory({ receiverUserId: chosenChatDetails?.id });
  }, [chosenChatDetails]);


  // When User try to logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      dispatch(login(data));
      toast.success("Logout Successfully");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //When User Try to send her friend invitation
  const handleInvite = async () => {
    if (!targetMailAddress) return toast.error("Email is require");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/invite-email`,
        {
          targetMailAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Invitation Sent");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
    setShowModel(!showmodel);
  };

  //When Any User invite acp friends request
  const handleAcceptInvitations = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friend-invitation/accept`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Invitation Accept");
    } catch (error) {
      console.log(error);
    }
  };

  //When Any User invite rej friends request
  const handleRejectedInvitations = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friend-invitation/reject`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.error("Invitation Rejected");
      dispatch(setPendingFriendsInvitations(null));
    } catch (error) {
      console.log(error);
    }
  };

  //Checking UserOnline or not
  const checkOnlineUsers = (allfriends = [], onlineUser = []) => {
    return allfriends?.map((f) => {
      const isUserOnline = onlineUser?.find((user) => user?.userId == f.id);
      return { ...f, isOnline: isUserOnline ? true : false };
    });
  };

  //When Message Input Change
  const handleChange = (e) => {
    setChatMessage(e.target.value);
  };

  // Handle Type Conversation
  const handleChooseActiveConversation = ({ id, username }) => {
    dispatch(
      setChosenChatDetails({
        chatDetails: { id, name: username },
        chatType: chatType.DIRECT,
      })
    );
  };

  //When User Submit Message Fire This function
  const handleSendMessage = () => {
    if (!chatMessage) return toast.error("Message Felids is require");
    sendDirectMessage({
      receiverUserId: chosenChatDetails?.id,
      content: chatMessage,
    });
    setChatMessage("");
  };

  const handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Room Handler
  const createNewRoomHandler = () => {
    //Create a room and sending info the server
    createNewRoom();
  };

  if (loading) return <Loader />;

  return (
    <>
      <Privet>
        <Meta title={"Ksdev Community - Welcome Dashboard"} />
        <section className={styles.dashboard}>
          <div className={styles.wrapper}>
            {/* User List */}
            <div className={styles.userList}>
              <div className={styles.icon}>
                <MdGroups size={20} />
              </div>
              <Button disabled={isUserInRoom} className={styles.icon} onClick={createNewRoomHandler}>
                <MdPersonAddAlt1 size={20} />
              </Button>
              {activeRooms &&
                activeRooms?.map((room) => (
                  <ActiveRoom
                    key={room.roomId}
                    creatorUsername={room.creatorUsername}
                    amountOfParticipants={room?.participants?.length}
                    isUserInRoom={isUserInRoom}
                    className={styles.icon}
                    roomId={room.roomId}
                  />
                ))}
            </div>
            {/* Friend List */}
            <div className={toggleSidebar ? `${styles.friendList} ${styles.friendListActive}` : styles.friendList}>
              <div className={styles.header}>
                <Button
                  className="app_btn"
                  type="button"
                  onClick={() => setShowModel(!showmodel)}
                >
                  Add Friend
                </Button>
                <h4 className={styles.msTitle}>Privet Message</h4>
              </div>
              {/* All Friend */}
              <div className={styles.wrapperFriend}>
                <div className={styles.friend}>
                  {/* Single Friend */}
                  {allFriends &&
                    checkOnlineUsers(allFriends, onlineUsers)?.map((friend) => (
                      <div
                        className={styles.singleFriend}
                        key={friend?.id}
                        onClick={() => handleChooseActiveConversation(friend)}
                      >
                        <div className={styles.left}>
                          <Avatar
                            size="50"
                            round={true}
                            name={friend?.username}
                          />
                          <h3>{friend?.username}</h3>
                        </div>
                        {/* Friend List Active Indecator */}
                        {friend?.isOnline && (
                          <div className={styles.active}></div>
                        )}
                      </div>
                    ))}
                </div>
                {/* Invitation List */}
                <div className={styles.invitation}>
                  <h4 className={styles.msTitle}>Invitations</h4>
                  {/* Invitation List */}
                  <div className={styles.friend}>
                    {/* Single Friend */}
                    {friends &&
                      friends?.map((invitation) => (
                        <div
                          className={styles.singleFriend}
                          key={invitation?._id}
                        >
                          <div className={styles.left}>
                            <Avatar
                              size="40"
                              round={true}
                              name={invitation?.senderId?.username}
                            />
                            <h3>{invitation?.senderId?.username}</h3>
                          </div>
                          {/* Friend List Active Indecator */}
                          <div className={styles.acpRej}>
                            <AiOutlineCheck
                              onClick={() =>
                                handleAcceptInvitations(invitation?._id)
                              }
                              size={20}
                            />
                            <AiOutlineClose
                              onClick={() =>
                                handleRejectedInvitations(invitation?._id)
                              }
                              size={20}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
              {/* Chat Navbar */}
              <div className={styles.navbar}>
                {/* Toogle Bars */}
                <div className={styles.bars} onClick={() => setToggleSideBar(!toggleSidebar)}> 
                  <FaBars size={30} />
                </div>

                <Button
                  type="button"
                  className="app_btn"
                  onClick={handleLogout}
                >
                  <span>Logout</span> <AiOutlineLogout size={20} />
                </Button>
              </div>
              {/* Default Welcome Message */}
              {!chosenChatDetails ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    height: "100%",
                    color: "#fff",
                  }}
                >
                  <h4>To Start chatting - choose conversation </h4>
                </div>
              ) : (
                <>
                  {/* Chat List Render Here */}
                  <div className={styles.chatList}>
                    <div className={styles.chatMain}>
                      <Avatar
                        size="50"
                        round={true}
                        name={chosenChatDetails?.name}
                      />
                      <h3 className={styles.h3}>Test1</h3>
                      <p className={styles.p}>
                        This is the begining of your conversations with razu
                      </p>
                      {/* Date With bar */}

                      {/* All Message Show Here */}
                      <div className={styles.chatWrapper}>
                        {messages &&
                          messages?.map((message) => (
                           message ? (
                            <div
                            className={styles.singleChat}
                            key={message?._id}
                          >
                            {/* User Avatar */}
                            <Avatar
                              size="30"
                              round={true}
                              name={message?.author?.username}
                            />
                            {/* User Sending Messagee */}
                            <div className={styles.userMessage}>
                              <h4>
                                {message?.author?.username}{" "}
                                <span>
                                  {moment(message?.date).calendar()}
                                </span>
                              </h4>
                              <p>{message?.content}</p>
                            </div>
                          </div>
                           ) : null
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Message Send Area */}
                  <div className={styles.sendMessage}>
                    <Input
                      type="text"
                      placeholder="Enter your message"
                      value={chatMessage}
                      onChange={handleChange}
                      onKeyDown={handleKeyPressed}
                      className="formInput"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Add Invitations Model */}
          <div
            className={
              showmodel
                ? `${styles.inviteModel} ${styles.activeModel}`
                : styles.inviteModel
            }
          >
            <h3>Invite a Friend</h3>
            <p>
              Enter e-mail address of friends which you would like to invite
            </p>
            <Input
              type="email"
              name="email"
              value={targetMailAddress}
              onChange={(e) => setTargetMailAddress(e.target.value)}
              placeholder="Enter email..."
            />
            <Button
              style={{
                width: "100%",
              }}
              type="button"
              className="app_btn"
              onClick={handleInvite}
            >
              Send
            </Button>
          </div>
          <div
            onClick={() => setShowModel(!showmodel)}
            className={
              showmodel
                ? `${styles.inviteOverlay} ${styles.activeOverlay}`
                : styles.inviteOverlay
            }
          ></div>
          {/* Rooms */}
          {isUserInRoom && <Room />}
        </section>
      </Privet>
    </>
  );
}

export default Home;
