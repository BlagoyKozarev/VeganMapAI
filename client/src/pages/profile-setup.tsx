import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  dietaryStyle: 'vegan' | 'vegetarian' | 'flexitarian';
  allergies: string[];
  preferredCuisines: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
}

const steps = [
  { id: 1, title: 'Dietary Style', description: 'What\'s your dietary style?' },
  { id: 2, title: 'Allergies', description: 'Do you have any allergies?' },
  { id: 3, title: 'Cuisines', description: 'What cuisines do you prefer?' },
  { id: 4, title: 'Budget', description: 'What\'s your price range?' },
];

const cuisineOptions = [
  'Mediterranean', 'Asian', 'Italian', 'Mexican', 'Indian', 'Thai', 'Japanese',
  'American', 'French', 'Middle Eastern', 'Ethiopian', 'Vietnamese', 'Korean'
];

const commonAllergens = [
  'Nuts', 'Gluten', 'Soy', 'Sesame', 'Corn', 'Citrus', 'Nightshades'
];

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    dietaryStyle: 'vegan',
    allergies: [],
    preferredCuisines: [],
    priceRange: '$$',
  });
  const [customAllergy, setCustomAllergy] = useState('');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await apiRequest('POST', '/api/profile', {
        ...data,
        maxDistance: 2000, // Default 2km
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Profile Created',
        description: 'Your profile has been set up successfully!',
      });
      setLocation('/home');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      createProfileMutation.mutate(profileData);
    }
  };

  const handleSkip = () => {
    createProfileMutation.mutate({
      dietaryStyle: 'vegan',
      allergies: [],
      preferredCuisines: ['Mediterranean'],
      priceRange: '$$',
    });
  };

  const handleAllergyChange = (allergen: string, checked: boolean) => {
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergen.toLowerCase()]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        allergies: prev.allergies.filter(a => a !== allergen.toLowerCase())
      }));
    }
  };

  const handleAddCustomAllergy = () => {
    if (customAllergy.trim()) {
      setProfileData(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim().toLowerCase()]
      }));
      setCustomAllergy('');
    }
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        preferredCuisines: [...prev.preferredCuisines, cuisine.toLowerCase()]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        preferredCuisines: prev.preferredCuisines.filter(c => c !== cuisine.toLowerCase())
      }));
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold">Profile Setup</h2>
            <Button 
              variant="ghost"
              onClick={handleSkip}
              className="text-vegan-green font-opensans font-medium hover:bg-vegan-light-green"
            >
              Skip
            </Button>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <p className="text-sm text-neutral-gray">Step {currentStep} of {steps.length}</p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto p-4">
        <div className="py-8">
          <h3 className="text-2xl font-poppins font-semibold mb-2">
            {steps[currentStep - 1].description}
          </h3>
          <p className="text-neutral-gray mb-6">
            This helps us recommend the best places for you
          </p>
          
          {currentStep === 1 && (
            <RadioGroup 
              value={profileData.dietaryStyle} 
              onValueChange={(value: 'vegan' | 'vegetarian' | 'flexitarian') => 
                setProfileData(prev => ({ ...prev, dietaryStyle: value }))
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-xl hover:border-vegan-green transition-colors">
                <RadioGroupItem value="vegan" id="vegan" className="border-vegan-green" />
                <Label htmlFor="vegan" className="flex-1 cursor-pointer">
                  <div>
                    <span className="font-opensans font-medium text-gray-900 block">Vegan</span>
                    <p className="text-sm text-neutral-gray">No animal products</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-xl hover:border-vegan-green transition-colors">
                <RadioGroupItem value="vegetarian" id="vegetarian" className="border-vegan-green" />
                <Label htmlFor="vegetarian" className="flex-1 cursor-pointer">
                  <div>
                    <span className="font-opensans font-medium text-gray-900 block">Vegetarian</span>
                    <p className="text-sm text-neutral-gray">No meat or fish</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-xl hover:border-vegan-green transition-colors">
                <RadioGroupItem value="flexitarian" id="flexitarian" className="border-vegan-green" />
                <Label htmlFor="flexitarian" className="flex-1 cursor-pointer">
                  <div>
                    <span className="font-opensans font-medium text-gray-900 block">Flexitarian</span>
                    <p className="text-sm text-neutral-gray">Mostly plant-based</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {commonAllergens.map((allergen) => (
                  <div key={allergen} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                    <Checkbox
                      id={allergen}
                      checked={profileData.allergies.includes(allergen.toLowerCase())}
                      onCheckedChange={(checked) => handleAllergyChange(allergen, checked as boolean)}
                      className="border-vegan-green data-[state=checked]:bg-vegan-green"
                    />
                    <Label htmlFor={allergen} className="text-sm font-opensans cursor-pointer">
                      {allergen}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  placeholder="Add custom allergy"
                  className="flex-1 border-gray-200 focus:border-vegan-green"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomAllergy()}
                />
                <Button 
                  onClick={handleAddCustomAllergy}
                  className="bg-vegan-green hover:bg-vegan-dark-green text-white"
                >
                  Add
                </Button>
              </div>
              
              {profileData.allergies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-opensans font-medium mb-2">Selected allergies:</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-opensans cursor-pointer"
                        onClick={() => handleAllergyChange(allergy, false)}
                      >
                        {allergy} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {cuisineOptions.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                    <Checkbox
                      id={cuisine}
                      checked={profileData.preferredCuisines.includes(cuisine.toLowerCase())}
                      onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                      className="border-vegan-green data-[state=checked]:bg-vegan-green"
                    />
                    <Label htmlFor={cuisine} className="text-sm font-opensans cursor-pointer">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
              
              {profileData.preferredCuisines.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-opensans font-medium mb-2">Selected cuisines:</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.preferredCuisines.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="bg-vegan-light-green text-vegan-green px-3 py-1 rounded-full text-sm font-opensans cursor-pointer"
                        onClick={() => handleCuisineChange(cuisine, false)}
                      >
                        {cuisine} ×
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <Select
                value={profileData.priceRange}
                onValueChange={(value: '$' | '$$' | '$$$' | '$$$$') =>
                  setProfileData(prev => ({ ...prev, priceRange: value }))
                }
              >
                <SelectTrigger className="w-full border-gray-200 focus:border-vegan-green">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ - Budget friendly</SelectItem>
                  <SelectItem value="$$">$$ - Moderate</SelectItem>
                  <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                  <SelectItem value="$$$$">$$$$ - Fine dining</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-opensans">$</span>
                  <span className="text-sm text-neutral-gray">Under $15 per person</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-opensans">$$</span>
                  <span className="text-sm text-neutral-gray">$15-30 per person</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-opensans">$$$</span>
                  <span className="text-sm text-neutral-gray">$30-60 per person</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-opensans">$$$$</span>
                  <span className="text-sm text-neutral-gray">$60+ per person</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={createProfileMutation.isPending}
          className="w-full bg-vegan-green text-white py-4 px-6 rounded-xl font-opensans font-medium mt-8 hover:bg-vegan-dark-green transition-colors"
        >
          {createProfileMutation.isPending 
            ? 'Creating Profile...' 
            : currentStep === steps.length 
              ? 'Complete Setup' 
              : 'Continue'
          }
        </Button>
      </div>
    </div>
  );
}
