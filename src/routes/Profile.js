import { authService } from "fbase";

const Profile = ({ user }) => {
  const onLogOutClick = () => authService.signOut();
  return <button onClick={onLogOutClick}>Log Out</button>;
};
export default Profile;
