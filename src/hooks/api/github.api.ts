import useAuthRequest from "../useAuthRequest";

export default function useGithubAPI() {
  const { request } = useAuthRequest();

  const getUserDetails = async () => {
    const response = await request("get", "/user");
    return response.data;
  };

  const getUserRepos = async (username: string) => {
    const response = await request(
      "get",
      `/users/${username}/repos`,
      {},
      {
        headers: { "If-None-Match": "" },
      }
    );
    return response.data;
  };

  const createRepo = async (formData: { [x: string]: FormDataEntryValue }) => {
    const response = await request("post", "/user/repos", { ...formData });
    return response.data;
  };

  const deleteRepo = async ({
    repoName,
    username,
  }: {
    repoName: string;
    username: string;
  }) => {
    const response = await request("delete", `/repos/${username}/${repoName}`, {
      owner: username,
      repo: repoName,
    });
    return response.data;
  };

  return { getUserDetails, getUserRepos, createRepo, deleteRepo };
}
