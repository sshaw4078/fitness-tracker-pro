import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { deleteRoutine, getRoutine } from "../api/routines";
import { useAuth } from "../auth/AuthContext";
import SetList from "./SetList";
import SetForm from "./SetForm";

/** Page with details about a single routine */
export default function RoutineDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncRoutine = async () => {
    setLoading(true);
    const data = await getRoutine(id);
    setRoutine(data);
    setLoading(false);
  };

  useEffect(() => {
    syncRoutine();
  }, [id]);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteRoutine(token, id);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!routine) return <p>Routine not found.</p>;

  return (
    <article>
      <h1>{routine.name}</h1>
      <p>{routine.goal}</p>
      <p>Created by {routine.creatorName}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}

      <h2>Sets</h2>
      <SetList
        routineId={id}
        sets={routine.sets || []}
        syncRoutine={syncRoutine}
      />
      {token && <SetForm routineId={id} syncRoutine={syncRoutine} />}
    </article>
  );
}