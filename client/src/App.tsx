import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Switch, Route } from 'wouter'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
          credentials: 'include',
        })
        if (!res.ok) {
          if (res.status >= 500) {
            throw new Error(`Server error: ${res.status}`)
          }
          throw new Error(`${res.status}: ${res.statusText}`)
        }
        return res.json()
      }
    }
  }
})

function Router() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App