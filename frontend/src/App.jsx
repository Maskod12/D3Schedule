import { useEffect, useState, useRef} from "react";
import { getShiftForMember } from "./utils/rotation";

function getDaysInMonth(year, month) {
  const dates = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    dates.push(new Date(date));

    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function App() {
  const [members, setMembers] = useState([]);
  const [currentDate, setCurrentDate] = useState(
  new Date(2026, 9, 1));



  useEffect(() => {
    fetch("http://localhost:5000/api/members")
      .then((response) => response.json())
      .then((data) => {
        setMembers(data.members);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
  const checkOrientation = () => {
    setIsPortrait(
      window.innerWidth < 768 &&
      window.innerHeight > window.innerWidth
    );
  };

  checkOrientation();

  window.addEventListener("resize", checkOrientation);

  return () => {
    window.removeEventListener("resize", checkOrientation);
  };
}, []);

  // Oktober 2026
  // JavaScript menggunakan 0 = Januari, jadi 9 = Oktober
  const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const dates = getDaysInMonth(year, month);
const rotationStartDate = new Date("2026-10-05T00:00:00");
const [isEditing, setIsEditing] = useState(false);
const [editMembers, setEditMembers] = useState([]);
const [isLoggedIn, setIsLoggedIn] = useState(false);

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loginError, setLoginError] = useState("");
const usernameInputRef = useRef(null);
const [notification, setNotification] = useState("");
const [isPortrait, setIsPortrait] = useState(false);



const handleEdit = () => {
  if (!isEditing) {
    setEditMembers([...members]);
  }

  setIsEditing(!isEditing);
};

const handleCancel = () => {
  setEditMembers([...members]);
  setIsEditing(false);
};

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
   " http://localhost:5000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setNotification("MANTAPPP LOGIN BERHASIL PAAKK🥳")
      setLoginError("");

      setTimeout(() => {
        setNotification("");
        setIsLoggedIn(true);
      }, 1200);
    } else {
      setLoginError(data.message);

      setUsername("");
      setPassword("");

      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 0);
    }
  } catch (error) {
    console.error("Error:", error);
    setLoginError("USERNAME DAN PASSWORDNYA SALAH PAKK!🤣")

    setUsername("");
    setPassword("");

    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 0);
  }
};

const handleLogout = () => {
  setIsLoggedIn(false);
  setUsername("");
  setPassword("");
  setLoginError("");
};
const handleSave = async () => {
  try {
    for (const member of editMembers) {
      await fetch(`http://localhost:5000/api/members/${member.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: member.name,
          nrp: member.nrp,
        }),
      });
    }

    setMembers(editMembers);
    setIsEditing(false);

    alert("Data berhasil disimpan!");
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal menyimpan data.");
  }
};


const handlePreviousMonth = () => {
  setCurrentDate(
    new Date(year, month - 1, 1)
  );
};

const handleNextMonth = () => {
  setCurrentDate(
    new Date(year, month + 1, 1)
  );
};

const monthName = currentDate.toLocaleDateString(
  "id-ID",
  {
    month: "long",
    year: "numeric",
  }
);

if (!isLoggedIn) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
{notification && (
  <div className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
    <span className="text-lg">✓</span>
    <span>{notification}</span>
  </div>
)}

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            D3Schedule
          </h1>

          <p className="mt-2 text-gray-500">
            Login untuk melihat jadwal shift
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
            ref={usernameInputRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
              placeholder="Masukkan username"
            />
          </div>

       <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-lg border px-4 py-3 pr-12"
    placeholder="Password"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

          {loginError && (
            <p className="text-sm text-red-600">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
          >
            Masuk
          </button>
        </form>
      </div>
      
<footer className="mt-6 text-center text-sm text-gray-500">
        © 2026 D3Schedule — by maskod
      </footer>

    </div>
    
  );
}

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 p-4">
      {isPortrait && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 p-6">
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
      <div className="mb-4 text-5xl">
        📱
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        Putar HP-nya BOS!
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Gunakan posisi horizontal agar jadwal shift terlihat lengkap.
      </p>

      <div className="mt-6 text-3xl">
      🔄️
      </div>
    </div>
  </div>
)}
      <div className="mx-auto w-full max-w-full">
       <div className="mb-6 flex items-start justify-between">
  <div>
    <h1 className="schedule-header text-2xl font-bold">
      Jadwal Shift
    </h1>

  <p className="schedule-month mt-1 text-lg text-gray-600">
  {monthName}
</p>
  </div>


<div className="flex items-center gap-3">
  <div className="text-lg font-medium tracking-wide text-green-600">
    D3Schedule
  </div>

  {!isEditing ? (
    <button
      onClick={handleEdit}
      className="p-2 text-black hover:text-gray-600"
      title="Edit"
    >
      ⚙️
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCancel}
        className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100"
      >
        Batal
      </button>

      <button
        onClick={handleSave}
        className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
      >
        Simpan
      </button>
    </div>
  )}

  <button
    onClick={handleLogout}
    className="text-sm text-gray-600 hover:text-red-600"
  >
    Keluar
  </button>
</div>
</div>


   <div className="schedule-wrapper w-full overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-max border-collapse">
            <thead>  
              <tr>
                <th className="schedule-name sticky left-0 z-30 w-[180px] min-w-[180px] border bg-gray-100 px-4 py-3 text-left">
  Nama
</th>

                <th className="schedule-nrp sticky left-[180px] z-30 w-[120px] min-w-[120px] border bg-gray-100 px-4 py-3 text-left">
  NRP
</th>

                {dates.map((date) => (
                  <th 
  key={date.toISOString()} 
  className={`schedule-date border px-5 py-3 text-center ${
    date < rotationStartDate ||
    date.getDay() === 0 ||
    date.getDay() === 6
      ? "bg-red-100 text-red-700"
      : "bg-gray-100"
  }`}
>
  {date.getDate()}
</th>
                ))}
              </tr>
            </thead>

            <tbody>
  {members.map((member) => (
    <tr key={member.id}>

     <td className="schedule-name sticky left-0 z-10 w-[180px] min-w-[180px] border bg-white px-4 py-3">
  {isEditing ? (
  <input
    type="text"
   value={editMembers.find((item) => item.id === member.id)?.name || ""}
    onChange={(e) => {
    setEditMembers(
      editMembers.map((item) =>
        item.id === member.id
          ? { ...item, name: e.target.value }
          : item
      )
    );
  }}
    className="w-full rounded border px-2 py-1"
  />
) : (
  member.name
)}
</td>

      <td className="schedule-nrp sticky left-[180px] z-10 w-[120px] min-w-[120px] border bg-white px-4 py-3">
  {isEditing ? (
  <input
    type="text"
     value={editMembers.find((item) => item.id === member.id)?.nrp || ""}
  onChange={(e) => {
    setEditMembers(
      editMembers.map((item) =>
        item.id === member.id
          ? { ...item, nrp: e.target.value }
          : item
      )
    );
  }}
    className="w-full rounded border px-2 py-1"
  />
) : (
  member.nrp
)}
</td>

      {dates.map((date) => (
        <td
          key={date.toISOString()}
          className={`schedule-date border px-5 py-3 text-center ${
            date < rotationStartDate ||
            date.getDay() === 0 ||
            date.getDay() === 6
              ? "bg-red-100 text-red-700"
              : ""
          }`}
        >
          {date < rotationStartDate ||
          date.getDay() === 0 ||
          date.getDay() === 6
            ? "0"
            : getShiftForMember(member.position, date)}
        </td>
      ))}

    </tr>
  ))}
</tbody>
          </table>
        </div>


       <div className="month-navigation mt-4 flex justify-between">
  <button
    onClick={handlePreviousMonth}
    className="rounded-lg border bg-white px-5 py-2"
  >
    ←
  </button>

  <button
    onClick={handleNextMonth}
    className="rounded-lg border bg-white px-5 py-2"
  >
    →
  </button>
</div>
      </div>
          <footer className="schedule-footer mt-8 pb-4 text-center text-sm text-gray-500">
  © 2026 D3Schedule — by Maskod12
</footer>
    </div>
  );
}



export default App;