import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGithubAPI from "../hooks/api/github.api";

function UserDetails() {
  const queryClient = useQueryClient();

  const { getUserDetails, getUserRepos, createRepo, deleteRepo } =
    useGithubAPI();

  const {
    data: user,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUserDetails,
  });

  const username = user?.login;

  const { data: repos, isLoading: loadingRepos } = useQuery({
    queryKey: ["repos", username],
    queryFn: () => getUserRepos(username),
    enabled: !!username,
  });

  const { mutateAsync: createNewRepo } = useMutation({
    mutationFn: createRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos", username] });
    },
  });

  const { mutateAsync: deleteCurrentRepo } = useMutation({
    mutationFn: deleteRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos", username] });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    for (var [key, value] of formData.entries()) {
      createNewRepo({ [key]: value });
    }
  };

  const handleRepoDelete = (name: string) => {
    deleteCurrentRepo({ repoName: name, username });
  };

  if (isLoading || isFetching) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Something went wrong.</h1>;
  }

  return (
    <main>
      <h1>Github User:</h1>

      <div>
        <img
          src={user?.avatar_url}
          alt="Github Avatar"
          style={{
            width: 200,
            height: 200,
            borderRadius: "100%",
            paddingBottom: 20,
          }}
        />

        <div>
          <strong>Username:</strong> {user?.login}
        </div>

        <div>
          <strong>Followers:</strong> {user?.followers}
        </div>

        <div>
          <strong>Following:</strong> {user?.following}
        </div>

        <div>
          <strong>Repos:</strong>
          {loadingRepos ? (
            <h2>Loading repos...</h2>
          ) : (
            <ul>
              {repos?.map((repo: any, index: number) => (
                <li key={index}>
                  {repo.name}
                  <button onClick={() => handleRepoDelete(repo.name)}>
                    DELETE
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <form id="form" onSubmit={handleSubmit} action="">
            <input type="text" name="name" id="name" />
            <button type="submit">Create Repo</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default UserDetails;
