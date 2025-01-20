declare module '@tanstack/react-query' {
  export interface QueryClient {
    new (config?: QueryClientConfig): QueryClient;
    prefetchQuery: <TData = unknown>(
      options: PrefetchQueryOptions<TData>
    ) => Promise<void>;
    clear(): void;
    invalidateQueries: (options: { queryKey: unknown[] }) => Promise<void>;
  }

  export interface QueryClientConfig {
    defaultOptions?: {
      queries?: {
        retry?: number;
        gcTime?: number;
        staleTime?: number;
      };
    };
  }

  export interface PrefetchQueryOptions<TData> {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    retry?: number;
    staleTime?: number;
  }

  export interface UseQueryResult<TData = unknown, TError = unknown> {
    data?: TData;
    error: TError | null;
    isLoading: boolean;
  }

  export function useQuery<TData = unknown, TError = unknown>(options: UseQueryOptions<TData, TError>): UseQueryResult<TData, TError>;

  export interface UseQueryOptions<TData = unknown, TError = unknown> {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    enabled?: boolean;
  }

  export interface UseMutationResult<TData = unknown, TError = unknown> {
    mutate: (variables?: any) => void;
    isLoading: boolean;
    error: TError | null;
    data?: TData;
  }

  export function useMutation<TData = unknown, TError = unknown, TVariables = void>(options: {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
  }): UseMutationResult<TData, TError>;

  export function useQueryClient(): QueryClient;
} 