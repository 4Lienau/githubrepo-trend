import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  FileText,
  Star,
  GitFork,
  Eye,
  Code,
  Calendar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RepositoryCardProps {
  repository: {
    name: string;
    description: string;
    url: string;
    owner: string;
    stars: number;
    forks: number;
    watchers: number;
    language: string;
    readmeUrl: string;
    analysis?: string;
    avatarUrl?: string;
    created_at?: string;
    updated_at?: string;
  };
}

const RepositoryCard = ({
  repository = {
    name: "react",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    url: "https://github.com/facebook/react",
    owner: "facebook",
    stars: 207000,
    forks: 42500,
    watchers: 6700,
    language: "JavaScript",
    readmeUrl: "https://github.com/facebook/react/blob/main/README.md",
    analysis:
      "React is a popular JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer and allows you to create reusable UI components.",
    avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4",
    created_at: "2013-05-29T05:40:26Z",
    updated_at: "2023-07-01T12:35:56Z",
  },
}: RepositoryCardProps) => {
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) {
      return "0";
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
      PHP: "bg-indigo-500",
      Ruby: "bg-red-600",
      Go: "bg-blue-400",
      Rust: "bg-orange-600",
      Swift: "bg-orange-500",
      Kotlin: "bg-purple-400",
      Dart: "bg-blue-300",
      "C++": "bg-pink-500",
      C: "bg-blue-800",
      Shell: "bg-green-600",
      HTML: "bg-red-400",
      CSS: "bg-blue-600",
    };

    return colors[language] || "bg-gray-500";
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden bg-white card-hover-effect border border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {repository.avatarUrl && (
            <img
              src={repository.avatarUrl}
              alt={`${repository.owner}'s avatar`}
              className="w-8 h-8 rounded-full ring-1 ring-primary/20"
            />
          )}
          <div>
            <Badge
              variant="outline"
              className="text-xs font-normal bg-primary/5"
            >
              {repository.owner}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold truncate text-blue-800 mt-3">
          {repository.name}
        </CardTitle>
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`w-3 h-3 rounded-full ${getLanguageColor(repository.language)}`}
          ></div>
          <span className="text-xs text-gray-500">{repository.language}</span>

          {repository.updated_at && (
            <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Updated {formatDate(repository.updated_at)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-3 mb-4">
          {repository.description}
        </CardDescription>

        <div className="mt-2">
          <h4 className="text-sm font-semibold mb-1">Analysis</h4>
          <p className="text-xs text-gray-600 line-clamp-4">
            {`Created on ${formatDate(repository.created_at)}. This ${repository.language || ""} repository has gained ${formatNumber(repository.stars)} stars and been forked ${formatNumber(repository.forks)} times. ${repository.analysis || ""}`}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between w-full text-sm text-gray-500">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{formatNumber(repository.stars)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{repository.stars.toLocaleString()} stars</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-blue-500" />
                  <span>{formatNumber(repository.forks)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{repository.forks.toLocaleString()} forks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span>{formatNumber(repository.watchers)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{repository.watchers.toLocaleString()} watchers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a
              href={repository.readmeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="w-4 h-4 mr-1" />
              README
            </a>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            asChild
          >
            <a href={repository.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              View Repo
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RepositoryCard;
