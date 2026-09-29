import { useEffect, useState } from "react";
import { getActivities } from "../api/activities";
import { createSet } from "../api/routines";
import { useAuth } from "../auth/AuthContext";


export default function SetForm({ routineId, syncRoutine }) {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActivities().then(setActivities);
  }, []);

  const trySubmit = async (formData) => {
    setError(null);

    const activityId = formData.get("activityId");
    const count = formData.get("count");

    try {
      await createSet(token, routineId, { activityId, count: Number(count) });
      syncRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h3>Add a set</h3>
      <form action={trySubmit}>
        <label>
          Activity
          <select name="activityId">
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reps
          <input type="number" name="count" required />
        </label>
        <button>Add set</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}