import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing } = useForm({
        code: '',
        recovery_code: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/user/confirm-two-factor-challenge');
    }

    return (
        <>
            <Head title="Verifikasi 2FA" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Verifikasi Dua Faktor</CardTitle>
                        <CardDescription>Masukkan kode dari aplikasi autentikator Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="code">Kode OTP</Label>
                                <InputOTP
                                    id="code"
                                    maxLength={6}
                                    value={data.code}
                                    onChange={(value) => setData('code', value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Memverifikasi...' : 'Verifikasi'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
