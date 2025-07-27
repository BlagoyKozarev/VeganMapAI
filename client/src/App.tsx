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
  // Temporarily skip authentication to test the map functionality
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/landing" component={Landing} />
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