import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import RepositoryCard from "./RepositoryCard";
import { ArrowUpDown, Filter, Star } from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}

interface RepositoryGridProps {
  repositories?: Repository[];
  isLoading?: boolean;
  category?: string;
}

const RepositoryGrid = ({
  repositories = [],
  isLoading = false,
}: RepositoryGridProps) => {
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "updated">("stars");
  const [filterLanguage, setFilterLanguage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minStars, setMinStars] = useState<number>(0);

  // Default repositories for display when none are provided
  const defaultRepositories: Repository[] = [
    {
      id: "1",
      name: "openai/gpt-4",
      description:
        "GPT-4 is a large multimodal model that can solve difficult problems with greater accuracy than previous models.",
      url: "https://github.com/openai/gpt-4",
      stars: 45000,
      forks: 8500,
      language: "Python",
      owner: {
        login: "openai",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=openai",
      },
      created_at: "2023-01-15",
      updated_at: "2023-06-20",
    },
    {
      id: "2",
      name: "huggingface/transformers",
      description:
        "State-of-the-art Natural Language Processing for PyTorch and TensorFlow.",
      url: "https://github.com/huggingface/transformers",
      stars: 38000,
      forks: 7200,
      language: "Python",
      owner: {
        login: "huggingface",
        avatar_url:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=huggingface",
      },
      created_at: "2022-11-05",
      updated_at: "2023-06-18",
    },
    {
      id: "3",
      name: "tensorflow/tensorflow",
      description: "An open source machine learning framework for everyone.",
      url: "https://github.com/tensorflow/tensorflow",
      stars: 175000,
      forks: 87000,
      language: "C++",
      owner: {
        login: "tensorflow",
        avatar_url:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=tensorflow",
      },
      created_at: "2015-11-07",
      updated_at: "2023-06-21",
    },
    {
      id: "4",
      name: "pytorch/pytorch",
      description:
        "Tensors and Dynamic neural networks in Python with strong GPU acceleration.",
      url: "https://github.com/pytorch/pytorch",
      stars: 68000,
      forks: 19000,
      language: "Python",
      owner: {
        login: "pytorch",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=pytorch",
      },
      created_at: "2016-08-13",
      updated_at: "2023-06-19",
    },
    {
      id: "5",
      name: "microsoft/DeepSpeed",
      description:
        "DeepSpeed is a deep learning optimization library that makes distributed training easy, efficient, and effective.",
      url: "https://github.com/microsoft/DeepSpeed",
      stars: 28000,
      forks: 3500,
      watchers: 1200,
      language: "Python",
      owner: {
        login: "microsoft",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft",
      },
      created_at: "2020-02-10",
      updated_at: "2023-06-17",
    },
  ];

  const displayRepositories =
    repositories.length > 0 ? repositories : defaultRepositories;

  // Sort repositories based on selected criteria
  const sortedRepositories = [...displayRepositories].sort((a, b) => {
    if (sortBy === "stars") return b.stars - a.stars;
    if (sortBy === "forks") return b.forks - a.forks;
    if (sortBy === "updated") {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
    return 0;
  });

  // Filter repositories by language, search term, and minimum stars
  const filteredRepositories = sortedRepositories.filter((repo) => {
    const matchesLanguage =
      filterLanguage && filterLanguage !== "all"
        ? repo.language.toLowerCase() === filterLanguage.toLowerCase()
        : true;
    const matchesSearch = searchTerm
      ? repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStars = repo.stars >= minStars;
    return matchesLanguage && matchesSearch && matchesStars;
  });

  // Get unique languages for filter dropdown
  const languages = Array.from(
    new Set(displayRepositories.map((repo) => repo.language)),
  );

  return (
    <div className="w-full bg-gradient-to-b from-background to-background/80 p-4 md:p-6">
      <Card className="p-4 mb-6 border border-primary/10 shadow-lg bg-card/95 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "stars" | "forks" | "updated")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars">Stars</SelectItem>
                <SelectItem value="forks">Forks</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative">
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[250px]"
              />
            </div>

            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="number"
                placeholder="Min stars"
                value={minStars || ""}
                onChange={(e) =>
                  setMinStars(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="pl-8 w-[120px]"
                min="0"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchTerm("");
                setMinStars(0);
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortBy(sortBy === "stars" ? "forks" : "stars")}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card
              key={i}
              className="h-[350px] animate-pulse bg-muted/50 border border-primary/5 shadow-md rounded-xl overflow-hidden"
            ></Card>
          ))}
        </div>
      ) : filteredRepositories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredRepositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={{
                name: repo.name,
                description: repo.description,
                url: repo.url || "",
                owner: repo.owner?.login || "",
                stars: repo.stars || 0,
                forks: repo.forks || 0,
                watchers: 0, // Default value since it's not in the Repository interface
                language: repo.language || "Unknown",
                readmeUrl: `${repo.url}/blob/main/README.md` || "",
                avatarUrl: repo.owner?.avatar_url,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No repositories found</h3>
          <p className="text-muted-foreground mt-2">
            Try changing your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default RepositoryGrid;
