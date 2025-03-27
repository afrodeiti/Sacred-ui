import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SacredIntentions() {
  const [intention, setIntention] = useState("");
  const [frequency, setFrequency] = useState("7.83");
  const [fieldType, setFieldType] = useState("flower_of_life");
  const [amplify, setAmplify] = useState(false);
  const [multiplier, setMultiplier] = useState("1.0");
  const [response, setResponse] = useState(null);
  const [healingCodes, setHealingCodes] = useState([]);
  const [codeQuery, setCodeQuery] = useState("");
  const [archives, setArchives] = useState([]);

  const API_BASE = "https://healing-api.onrender.com";

  const handleSubmit = async () => {
    const res = await fetch(`${API_BASE}/api/network-packet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intention,
        frequency: parseFloat(frequency),
        field_type: fieldType,
        amplify,
        multiplier: parseFloat(multiplier),
      }),
    });
    const data = await res.json();
    setResponse(data);
  };

  const handleSearchCodes = async () => {
    const res = await fetch(`${API_BASE}/api/healing-codes?search=${codeQuery}`);
    const data = await res.json();
    setHealingCodes(data);
  };

  const loadArchives = async () => {
    const res = await fetch(`${API_BASE}/api/soul-archives`);
    const data = await res.json();
    setArchives(data);
  };

  useEffect(() => {
    loadArchives();
  }, []);

  const renderGeometryImage = () => {
    if (!response || !response.packet) return null;
    const field = response.packet.payload.field_type;
    const intentionHash = response.packet.payload.intention?.replace(/\s/g, "_");
    const imageUrl = `${API_BASE}/static/images/${field}_${intentionHash}.svg`;
    return (
      <img
        src={imageUrl}
        alt={`${field} geometry`}
        className="mt-4 w-full border rounded shadow"
      />
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <Card className="shadow-lg border-2 border-indigo-300">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-bold text-indigo-700">Sacred Intention Broadcaster</h2>

          <Input
            placeholder="Enter your intention..."
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
          />

          <div className="flex gap-4 items-center flex-wrap">
            <Label htmlFor="frequency">Frequency (Hz)</Label>
            <Input
              id="frequency"
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-24"
            />
            <Label htmlFor="multiplier">Multiplier</Label>
            <Input
              id="multiplier"
              type="number"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-20"
            />
            <Label htmlFor="amplify">Amplify</Label>
            <Switch
              id="amplify"
              checked={amplify}
              onCheckedChange={setAmplify}
            />
          </div>

          <RadioGroup value={fieldType} onValueChange={setFieldType} className="space-y-2">
            <Label>Geometry Field:</Label>
            <div className="flex flex-wrap gap-4">
              {[
                ["flower_of_life", "Flower of Life"],
                ["merkaba", "Merkaba"],
                ["torus", "Torus"],
                ["metatron", "Metatron's Cube"],
                ["sri_yantra", "Sri Yantra"],
              ].map(([val, label]) => (
                <div key={val} className="flex items-center gap-1">
                  <RadioGroupItem value={val} id={val} />
                  <Label htmlFor={val}>{label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button onClick={handleSubmit} className="w-full bg-indigo-600 text-white">
            Broadcast Intention
          </Button>

          {response && (
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Intention:</strong> {response.packet?.payload?.intention}</p>
              <p><strong>Frequency:</strong> {response.packet?.payload?.frequency} Hz</p>
              <p><strong>Field:</strong> {response.packet?.payload?.field_type}</p>
              <p className="break-all"><strong>Packet (base64):</strong> {response.packet_base64}</p>
              {renderGeometryImage()}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-purple-300">
        <CardContent className="p-4">
          <h3 className="font-semibold text-purple-700">Search Healing Codes</h3>
          <div className="flex gap-2 items-center mt-2">
            <Input
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              placeholder="e.g. love, confidence"
            />
            <Button onClick={handleSearchCodes}>Search</Button>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {healingCodes.map((code) => (
              <div key={code.code} className="p-2 border rounded bg-gray-50">
                <strong>{code.code}</strong>: {code.description} <em>({code.category})</em>
                {code.affirmation && (
                  <p className="text-xs italic">"{code.affirmation}"</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-green-300">
        <CardContent className="p-4">
          <h3 className="font-semibold text-green-700">Soul Archive</h3>
          <div className="mt-2 space-y-2 text-sm">
            {archives.map((entry) => (
              <div key={entry.id} className="p-2 border rounded bg-green-50">
                <p><strong>{entry.title}</strong> — {entry.intention}</p>
                <p><em>{entry.pattern_type}</em> @ {entry.frequency}Hz</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
