import React, { useEffect, useState } from 'react';
import FormLoginAdmin from '../components/formLoginAdmin';
import FormUploadFiles from '../components/formUploadFiles';

const AdminPage: React.FC = () => {
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    const userSession = sessionStorage.getItem("userLogged");

    if (userSession === 'true') {
      setUserLogged(true);
    }
  }, []);

  return (
    <div className="container mx-auto p-5 md:px-10 lg:px-14 xl:16">
      {!userLogged ? (
        <FormLoginAdmin />
      ) : (
        <FormUploadFiles />
      )}
    </div>
  );
};

export default AdminPage;
