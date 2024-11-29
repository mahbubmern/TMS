import avatar from "../../../src/assets/frontend/img/Avatar.png";

const Avatar = ({ url, className, width }) => {
  return (
    <>
      <img style={{height: '40px', width: '40px', objectFit: 'cover', borderRadius : '50%'}}
        src={url ? url : avatar}
      />
    </>
  );
};

export default Avatar;

