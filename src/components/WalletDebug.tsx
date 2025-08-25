import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { multiWalletService } from '../services/multiWalletService';
import { 
  Bug, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Wallet,
  Info
} from 'lucide-react';

export const WalletDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  const refreshDebugInfo = () => {
    const info: any = {};
    
    // Check window object
    info.window = {
      exists: typeof window !== 'undefined',
      ic: {
        exists: !!(window as any).ic,
        plug: !!(window as any).ic?.plug,
        plugWallet: !!(window as any).ic?.plugWallet,
        internetIdentity: !!(window as any).ic?.internetIdentity,
        astrox: !!(window as any).ic?.astrox,
        stoic: !!(window as any).ic?.stoic
      },
      direct: {
        plug: !!(window as any).plug,
        PlugWallet: !!(window as any).PlugWallet,
        InternetIdentity: !!(window as any).InternetIdentity,
        AstroX: !!(window as any).AstroX,
        StoicWallet: !!(window as any).StoicWallet
      }
    };

    // Check service detection
    info.service = {
      plugInstalled: multiWalletService['isPlugInstalled'](),
      plugConnected: multiWalletService['isPlugConnected'](),
      internetIdentityAvailable: multiWalletService['isInternetIdentityAvailable'](),
      astroXAvailable: multiWalletService['isAstroXAvailable'](),
      stoicAvailable: multiWalletService['isStoicAvailable']()
    };

    // Check Plug wallet methods if available
    if ((window as any).ic?.plug) {
      const plug = (window as any).ic.plug;
      info.plugMethods = {
        isConnected: typeof plug.isConnected === 'function',
        requestConnect: typeof plug.requestConnect === 'function',
        connect: typeof plug.connect === 'function',
        getPrincipal: typeof plug.getPrincipal === 'function',
        getAccountId: typeof plug.getAccountId === 'function',
        disconnect: typeof plug.disconnect === 'function'
      };
    }

    setDebugInfo(info);
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const getStatusIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (value: boolean) => {
    return value ? (
      <Badge variant="default" className="bg-green-500">Available</Badge>
    ) : (
      <Badge variant="destructive">Not Available</Badge>
    );
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-orange-300 hover:bg-orange-50"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Wallets
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bug className="h-5 w-5 text-orange-500" />
            <span>Wallet Detection Debug</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={refreshDebugInfo}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Window Object Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-500" />
              <span>Window Object Status</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">window.ic.*</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>window.ic exists:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.window?.ic?.exists)}
                      {getStatusBadge(debugInfo.window?.ic?.exists)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>window.ic.plug:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.window?.ic?.plug)}
                      {getStatusBadge(debugInfo.window?.ic?.plug)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>window.ic.plugWallet:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.window?.ic?.plugWallet)}
                      {getStatusBadge(debugInfo.window?.ic?.plugWallet)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Direct Window Properties</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>window.plug:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.window?.direct?.plug)}
                      {getStatusBadge(debugInfo.window?.direct?.plug)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>window.PlugWallet:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.window?.direct?.PlugWallet)}
                      {getStatusBadge(debugInfo.window?.direct?.PlugWallet)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Detection Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-500" />
              <span>Service Detection Results</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Plug Wallet</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Installed:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.service?.plugInstalled)}
                      {getStatusBadge(debugInfo.service?.plugInstalled)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connected:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(debugInfo.service?.plugConnected)}
                      {getStatusBadge(debugInfo.service?.plugConnected)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Other Wallets</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Internet Identity:</span>
                    {getStatusBadge(debugInfo.service?.internetIdentityAvailable)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AstroX:</span>
                    {getStatusBadge(debugInfo.service?.astroXAvailable)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Stoic:</span>
                    {getStatusBadge(debugInfo.service?.stoicAvailable)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plug Wallet Methods */}
          {debugInfo.plugMethods && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span>Plug Wallet Methods</span>
              </h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(debugInfo.plugMethods).map(([method, available]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{method}:</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(available as boolean)}
                        {getStatusBadge(available as boolean)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Raw Debug Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Raw Debug Information</h3>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
