import { useState } from "react";
import { deleteSet } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

export default function SetList({ routineId, sets, syncRoutine }) {
  if (sets.length === 0) {
    return <p>No sets yet. Add one below to get started!</p>;
  }

  return (
    <ul>
      {sets.map((set) => (
        <SetListItem
          key={set.id}
          routineId={routineId}
          set={set}
          syncRoutine={syncRoutine}
        />
      ))}
    </ul>
  );
}

function SetListItem({ routineId, set, syncRoutine }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryDelete = async () => {
    setError(null);
    try {
      await deleteSet(token, routineId, set.id);
      syncRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      {set.activityName}: {set.count}
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
    </li>
  );
}