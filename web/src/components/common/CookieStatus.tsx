import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionCookie } from '../../utils/api';

const CookieStatus: React.FC = () => {
  const [sessionCookie, setSessionCookie] = useState<string>('');
  const [allCookies, setAllCookies] = useState<string>('');

  const updateStatus = () => {
    setSessionCookie(getSessionCookie() || '无');
    setAllCookies(document.cookie || '无');
  };

  useEffect(() => {
    updateStatus();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">Cookie 状态</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="text-xs font-medium mb-1">Session Cookie:</div>
          <div className="text-xs bg-muted p-2 rounded break-all">
            {sessionCookie}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium mb-1">所有 Cookie:</div>
          <div className="text-xs bg-muted p-2 rounded break-all">
            {allCookies}
          </div>
        </div>
        <Button
          onClick={updateStatus}
          size="sm"
          variant="outline"
          className="w-full"
        >
          刷新状态
        </Button>
      </CardContent>
    </Card>
  );
};

export default CookieStatus;
