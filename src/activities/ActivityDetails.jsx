import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { deleteActivity, getActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

/** Page with details about a single activity */
export default function ActivityDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncActivity = async () => {
      setLoading(true);
      const data = await getActivity(id);
      setActivity(data);
      setLoading(false);
    };
    syncActivity();
  }, [id]);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteActivity(token, id);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!activity) return <p>Activity not found.</p>;

  return (
    <article>
      <h1>{activity.name}</h1>
      <p>{activity.description}</p>
      <p>Created by {activity.creatorName}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
    </article>
  );
}