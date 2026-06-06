import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector, useDispatch } from 'react-redux';
import { selectuser, login } from '@/Feature/Userslice';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/Components/ProtectedRoute';
import { Check, X, Shield, Zap, Crown, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const plans = [
  {
    name: 'Free',
    price: 0,
    apps: 1,
    features: ['1 application per month', 'Basic support', 'Standard profile access'],
    color: 'bg-gray-100',
    icon: <Shield className="w-8 h-8 text-gray-600 mb-2" />
  },
  {
    name: 'Bronze',
    price: 100,
    apps: 3,
    features: ['3 applications per month', 'Priority support', 'Standard profile access'],
    color: 'bg-orange-50',
    icon: <Shield className="w-8 h-8 text-orange-600 mb-2" />
  },
  {
    name: 'Silver',
    price: 300,
    apps: 5,
    features: ['5 applications per month', 'Priority support', 'Premium profile badge'],
    color: 'bg-gray-200',
    icon: <Zap className="w-8 h-8 text-gray-700 mb-2" />
  },
  {
    name: 'Gold',
    price: 1000,
    apps: 'Unlimited',
    features: ['Unlimited applications', '24/7 Priority support', 'Premium profile badge', 'Direct messaging'],
    color: 'bg-yellow-50',
    icon: <Crown className="w-8 h-8 text-yellow-600 mb-2" />
  }
];

const Subscriptions: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector(selectuser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [appsUsed, setAppsUsed] = useState(0);

  useEffect(() => {
    // Load razorpay
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Fetch user plan details (simulating by querying sync or assuming user has it)
    if (user) {
      axios.post(`${API_BASE_URL}/api/users/sync`, { uid: user.uid, name: user.name, email: user.email, photo: user.photo })
        .then(res => {
          setCurrentPlan(res.data.subscriptionPlan || 'Free');
          setAppsUsed(res.data.applicationsUsedThisMonth || 0);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSubscribe = async (planName: string, price: number) => {
    if (!user) return toast.error("Please login first");
    if (price === 0) return toast.info("You are already on the Free plan.");
    if (planName === currentPlan) return toast.info(`You already have the ${planName} plan.`);

    setLoading(true);
    try {
      const { data: orderData } = await axios.post(`${API_BASE_URL}/api/subscription/create-order`, { 
        uid: user.uid, 
        plan: planName 
      });

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Internshala Clone",
        description: `${planName} Plan Upgrade`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/subscription/verify-payment`, {
              ...response,
              uid: user.uid
            });
            toast.success(`Successfully upgraded to ${verifyRes.data.plan}!`);
            setCurrentPlan(verifyRes.data.plan);
            // Optionally dispatch to redux if storing plan there
          } catch (err: any) {
            toast.error(err.response?.data?.error || "Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function () {
        toast.error("Payment was cancelled or failed.");
      });
      rzp.open();

    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error(error.response.data.error, { autoClose: 5000 });
      } else {
        toast.error("Failed to initiate payment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('subscription.title')}
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              {t('subscription.desc')}
            </p>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3 max-w-2xl mx-auto">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">{t('subscription.current')}</h4>
              <p className="text-sm text-blue-800">You are on the <strong>{currentPlan}</strong> {t('subscription.plan')} and have used <strong>{appsUsed}</strong> applications this month.</p>
              <p className="text-xs text-blue-700 mt-1">* Payments are only accepted between 10:00 AM and 11:00 AM IST.</p>
            </div>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white ${currentPlan === plan.name ? 'ring-2 ring-blue-500 transform scale-105 transition-transform' : ''}`}>
                <div className={`p-6 ${plan.color} rounded-t-lg`}>
                  {plan.icon}
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h2>
                  <p className="mt-4 text-sm text-gray-500">Unlock your potential.</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/mo</span>
                  </p>
                  <button
                    onClick={() => handleSubscribe(plan.name, plan.price)}
                    disabled={loading || currentPlan === plan.name}
                    className={`mt-8 block w-full py-2 px-3 border border-transparent rounded-md text-center text-sm font-semibold text-white focus:outline-none transition-colors ${
                      currentPlan === plan.name 
                        ? 'bg-green-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {currentPlan === plan.name ? 'Current Plan' : (plan.price === 0 ? 'Included' : t('subscription.subscribe'))}
                  </button>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex space-x-3">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Subscriptions;
