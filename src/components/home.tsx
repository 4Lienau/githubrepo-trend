import React, { useState } from "react";
import axios from "axios";
import SearchInterface from "./SearchInterface";
import RepositoryGrid from "./RepositoryGrid";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  watchers_count?: number;
}

interface GitHubSearchResponse {
  items: any[];
  total_count: number;
}

export default function Home() {
  const [category, setCategory] = useState<string>("AI");
  const [count, setCount] = useState<number>(5);
  const [searchType, setSearchType] = useState<string>("category");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (
    searchCategory: string,
    repoCount: number,
    type: string = "category",
    minStarCount: number = 0,
  ) => {
    setLoading(true);
    setError(null);
    setCategory(searchCategory);
    setCount(repoCount);
    setSearchType(type);

    try {
      let response;

      if (type === "top-stars") {
        // For top starred repositories, we don't filter by category or date
        // We just get the repositories with the most stars
        const minStarsFilter = minStarCount > 0 ? minStarCount : 10000;
        response = await axios.get<GitHubSearchResponse>(
          `https://api.github.com/search/repositories`,
          {
            params: {
              q: `stars:>${minStarsFilter}`, // Use the provided minimum stars or default to 10,000
              sort: "stars",
              order: "desc",
              per_page: 10, // Always get top 10 for this search type
            },
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );
      } else {
        // Regular category search
        // Create a date 30 days ago for trending repositories
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateString = thirtyDaysAgo.toISOString().split("T")[0];

        // Build the GitHub search query
        // Search for repositories created after the date with the given category
        // Sort by stars to get the most popular ones
        // Add minimum stars filter if specified
        const starsFilter = minStarCount > 0 ? ` stars:>${minStarCount}` : "";
        const query = `${searchCategory} created:>${dateString}${starsFilter}`;

        response = await axios.get<GitHubSearchResponse>(
          `https://api.github.com/search/repositories`,
          {
            params: {
              q: query,
              sort: "stars",
              order: "desc",
              per_page: repoCount,
            },
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );
      }

      // Map the GitHub API response to our Repository interface
      const githubRepos: Repository[] = response.data.items.map((item) => ({
        id: item.id,
        name: item.name,
        full_name: item.full_name,
        description:
          item.description ||
          `A trending repository with ${item.stargazers_count} stars`,
        html_url: item.html_url,
        stargazers_count: item.stargazers_count,
        forks_count: item.forks_count,
        watchers_count: item.watchers ? item.watchers : 0,
        language: item.language || "Unknown",
        created_at: item.created_at,
        updated_at: item.updated_at,
        owner: {
          login: item.owner.login,
          avatar_url: item.owner.avatar_url,
        },
      }));

      setRepositories(githubRepos);
    } catch (err) {
      // Handle rate limiting errors specifically
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("GitHub API rate limit exceeded. Please try again later.");
      } else {
        setError("Failed to fetch repositories. Please try again.");
      }
      console.error("Error fetching repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial search on component mount
  React.useEffect(() => {
    handleSearch(category, count);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary relative z-10">
            GitHub Trending Explorer
          </h1>
          <p className="text-muted-foreground">
            Discover trending repositories based on your interests
          </p>
        </header>

        <SearchInterface onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="mt-6 mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {searchType === "top-stars"
              ? "Top 10 Starred Repositories"
              : `Trending ${category} Repositories`}
          </h2>
          <p className="text-muted-foreground mt-1">
            {searchType === "top-stars"
              ? "The most popular repositories on GitHub by star count"
              : `Showing ${repositories.length} trending repositories for "${category}"`}
          </p>
        </div>

        <RepositoryGrid
          repositories={repositories.map((repo) => ({
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count || 0,
            language: repo.language,
            owner: {
              login: repo.owner.login,
              avatar_url: repo.owner.avatar_url,
            },
            created_at: repo.created_at,
            updated_at: repo.updated_at,
          }))}
          isLoading={loading}
          category={searchType === "top-stars" ? "top-stars" : category}
        />
      </div>
    </div>
  );
}
